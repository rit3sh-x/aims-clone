import { createTRPCRouter } from "@workspace/api/init";
import {
    createHodInputSchema,
    getHodByIdInputSchema,
    listHodsInputSchema,
    updateHodInputSchema,
} from "../schema";
import { adminProcedure } from "../middleware";
import { db, hod, department, logAuditEvent, user } from "@workspace/db";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { auth } from "@workspace/auth";
import { randomHex } from "../utils";

export const hodManagement = createTRPCRouter({
    list: adminProcedure.input(listHodsInputSchema).query(async ({ input }) => {
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
                    lt(hod.createdAt, cursor.createdAt),
                    and(
                        eq(hod.createdAt, cursor.createdAt),
                        lt(hod.id, cursor.id)
                    )
                )
            );
        }

        const where = conditions.length ? and(...conditions) : undefined;

        const rows = await db
            .select({
                hod,
                user,
                department,
            })
            .from(hod)
            .innerJoin(user, eq(hod.userId, user.id))
            .innerJoin(department, eq(hod.departmentId, department.id))
            .where(where)
            .orderBy(desc(hod.createdAt), desc(hod.id))
            .limit(pageSize + 1);

        const hasNextPage = rows.length > pageSize;
        const items = hasNextPage ? rows.slice(0, pageSize) : rows;

        const nextCursor = hasNextPage
            ? {
                  createdAt: items[items.length - 1]!.hod.createdAt,
                  id: items[items.length - 1]!.hod.id,
              }
            : null;

        return {
            items,
            nextCursor,
            hasNextPage,
        };
    }),

    getById: adminProcedure
        .input(getHodByIdInputSchema)
        .query(async ({ input }) => {
            const { id } = input;

            const [uniqueHod] = await db
                .select({
                    hod,
                    user,
                    department,
                })
                .from(hod)
                .innerJoin(user, eq(hod.userId, user.id))
                .innerJoin(department, eq(hod.departmentId, department.id))
                .where(eq(hod.id, id))
                .limit(1);

            if (!uniqueHod) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "HOD not found",
                });
            }

            return uniqueHod;
        }),

    create: adminProcedure
        .input(createHodInputSchema)
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

            const existingHod = await db.query.hod.findFirst({
                where: eq(hod.departmentId, dept.id),
            });

            if (existingHod) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Department already has a HOD",
                });
            }

            const { user: newUser } = await auth.api.createUser({
                body: {
                    email,
                    password: randomHex(),
                    name,
                    role: "HOD",
                },
                headers,
            });

            const [created] = await db
                .insert(hod)
                .values({
                    departmentId: dept.id,
                    userId: newUser.id,
                })
                .returning();

            if (!created) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create HOD",
                });
            }

            await logAuditEvent({
                userId: user.id,
                action: "CREATE",
                entityType: "HOD",
                entityId: created.id,
                after: created,
            });

            return created;
        }),

    update: adminProcedure
        .input(updateHodInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { id, departmentCode, email, name } = input;
            const { user: currentUser } = ctx.session;

            const existing = await db.query.hod.findFirst({
                where: eq(hod.id, id),
            });

            if (!existing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "HOD not found",
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

                // Check if new department already has a HOD
                if (dept.id !== existing.departmentId) {
                    const existingHod = await db.query.hod.findFirst({
                        where: eq(hod.departmentId, dept.id),
                    });

                    if (existingHod) {
                        throw new TRPCError({
                            code: "CONFLICT",
                            message: "Department already has a HOD",
                        });
                    }
                }

                departmentId = dept.id;
            }

            const updated = await db.transaction(async (tx) => {
                const [updatedHod] = await tx
                    .update(hod)
                    .set({
                        ...(departmentId && { departmentId }),
                    })
                    .where(eq(hod.id, id))
                    .returning();

                await tx
                    .update(user)
                    .set({
                        ...(email && { email }),
                        ...(name && { name }),
                    })
                    .where(eq(user.id, existing.userId));

                return updatedHod;
            });

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update HOD",
                });
            }

            await logAuditEvent({
                userId: currentUser.id,
                action: "UPDATE",
                entityType: "HOD",
                entityId: id,
                before: existing,
                after: updated,
            });

            return updated;
        }),
});
