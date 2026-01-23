import { createTRPCRouter } from "@workspace/api/init";
import {
    createAdvisorInputSchema,
    getAdvisorByIdInputSchema,
    listAdvisorsInputSchema,
    updateAdvisorInputSchema,
} from "../schema";
import { adminProcedure } from "../middleware";
import { db, advisor, department, logAuditEvent, user } from "@workspace/db";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { auth } from "@workspace/auth";
import { randomHex } from "../utils";

export const advisorManagement = createTRPCRouter({
    list: adminProcedure
        .input(listAdvisorsInputSchema)
        .query(async ({ input }) => {
            const { pageSize, cursor, departmentCode, search } = input;

            const conditions = [];

            if (departmentCode) {
                conditions.push(eq(department.code, departmentCode));
            }

            if (search) {
                conditions.push(
                    or(
                        ilike(user.name, `%${search}%`),
                        ilike(user.email, `%${search}%`)
                    )
                );
            }

            if (cursor) {
                conditions.push(
                    or(
                        lt(advisor.createdAt, cursor.createdAt),
                        and(
                            eq(advisor.createdAt, cursor.createdAt),
                            lt(advisor.id, cursor.id)
                        )
                    )
                );
            }

            const where = conditions.length ? and(...conditions) : undefined;

            const rows = await db
                .select({
                    advisor,
                    user,
                    department,
                })
                .from(advisor)
                .innerJoin(user, eq(advisor.userId, user.id))
                .innerJoin(department, eq(advisor.departmentId, department.id))
                .where(where)
                .orderBy(desc(advisor.createdAt), desc(advisor.id))
                .limit(pageSize + 1);

            const hasNextPage = rows.length > pageSize;
            const items = hasNextPage ? rows.slice(0, pageSize) : rows;

            const nextCursor = hasNextPage
                ? {
                      createdAt: items[items.length - 1]!.advisor.createdAt,
                      id: items[items.length - 1]!.advisor.id,
                  }
                : null;

            return {
                items,
                nextCursor,
                hasNextPage,
            };
        }),

    getById: adminProcedure
        .input(getAdvisorByIdInputSchema)
        .query(async ({ input }) => {
            const { id } = input;

            const [uniqueAdvisor] = await db
                .select({
                    advisor,
                    user,
                    department,
                })
                .from(advisor)
                .innerJoin(user, eq(advisor.userId, user.id))
                .innerJoin(department, eq(advisor.departmentId, department.id))
                .where(eq(advisor.id, id))
                .limit(1);

            if (!uniqueAdvisor) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Advisor not found",
                });
            }

            return uniqueAdvisor;
        }),

    create: adminProcedure
        .input(createAdvisorInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { departmentCode, email, name } = input;
            const { user } = ctx.session;
            const { headers } = ctx;

            const dept = await db.query.department.findFirst({
                where: (d, { eq }) => eq(d.code, departmentCode),
            });

            if (!dept) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No department found",
                });
            }

            const { user: newUser } = await auth.api.createUser({
                body: {
                    email,
                    password: randomHex(),
                    name,
                    role: "ADVISOR",
                },
                headers,
            });

            const [created] = await db
                .insert(advisor)
                .values({
                    departmentId: dept.id,
                    userId: newUser.id,
                })
                .returning();

            if (!created) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create advisor",
                });
            }

            await logAuditEvent({
                userId: user.id,
                action: "CREATE",
                entityType: "ADVISOR",
                entityId: created.id,
                after: created,
            });

            return created;
        }),

    update: adminProcedure
        .input(updateAdvisorInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { id, departmentCode, email, name } = input;
            const { user: currentUser } = ctx.session;

            const existing = await db.query.advisor.findFirst({
                where: eq(advisor.id, id),
            });

            if (!existing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Advisor not found",
                });
            }

            let departmentId: string | undefined;

            if (departmentCode) {
                const dept = await db.query.department.findFirst({
                    where: (d, { eq }) => eq(d.code, departmentCode),
                });

                if (!dept) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "No department found",
                    });
                }

                departmentId = dept.id;
            }

            const updated = await db.transaction(async (tx) => {
                const [updatedAdvisor] = await tx
                    .update(advisor)
                    .set({
                        ...(departmentId && { departmentId }),
                    })
                    .where(eq(advisor.id, id))
                    .returning();

                await tx
                    .update(user)
                    .set({
                        ...(email && { email }),
                        ...(name && { name }),
                    })
                    .where(eq(user.id, existing.userId));

                return updatedAdvisor;
            });

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update advisor",
                });
            }

            await logAuditEvent({
                userId: currentUser.id,
                action: "UPDATE",
                entityType: "ADVISOR",
                entityId: id,
                before: existing,
                after: updated,
            });

            return updated;
        }),
});
