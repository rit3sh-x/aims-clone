import { createTRPCRouter } from "@workspace/api/init";
import {
    createInstructorInputSchema,
    getInstructorsByIdInputSchema,
    listInstructorsInputSchema,
    updateInstructorInputSchema,
} from "../schema";
import { adminProcedure } from "../middleware";
import {
    account,
    db,
    department,
    instructor,
    logAuditEvent,
    twoFactor,
    user,
} from "@workspace/db";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { auth } from "@workspace/auth";
import { randomHex } from "../utils";

export const instructorManagement = createTRPCRouter({
    list: adminProcedure
        .input(listInstructorsInputSchema)
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
                        lt(instructor.createdAt, cursor.createdAt),
                        and(
                            eq(instructor.createdAt, cursor.createdAt),
                            lt(instructor.id, cursor.id)
                        )
                    )
                );
            }

            const where = conditions.length ? and(...conditions) : undefined;

            const rows = await db
                .select({
                    instructor,
                    user,
                    department,
                })
                .from(instructor)
                .innerJoin(user, eq(instructor.userId, user.id))
                .innerJoin(
                    department,
                    eq(instructor.departmentId, department.id)
                )
                .where(where)
                .orderBy(desc(instructor.createdAt), desc(instructor.id))
                .limit(pageSize + 1);

            const hasNextPage = rows.length > pageSize;
            const items = hasNextPage ? rows.slice(0, pageSize) : rows;

            const nextCursor = hasNextPage
                ? {
                      createdAt: items[items.length - 1]!.instructor.createdAt,
                      id: items[items.length - 1]!.instructor.id,
                  }
                : null;

            return {
                items,
                nextCursor,
                hasNextPage,
            };
        }),

    getById: adminProcedure
        .input(getInstructorsByIdInputSchema)
        .query(async ({ input }) => {
            const { id } = input;

            const [uniqueInstructor] = await db
                .select({
                    instructor,
                    user,
                    department,
                })
                .from(instructor)
                .innerJoin(user, eq(instructor.userId, user.id))
                .innerJoin(
                    department,
                    eq(instructor.departmentId, department.id)
                )
                .where(eq(instructor.id, id))
                .limit(1);

            if (!uniqueInstructor) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Instructor not found",
                });
            }

            return uniqueInstructor;
        }),

    create: adminProcedure
        .input(createInstructorInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { departmentCode, designation, email, name, employeeId } =
                input;
            const { user: currentUser } = ctx.session;

            const dept = await db.query.department.findFirst({
                where: (d, { eq }) => eq(d.code, departmentCode),
            });

            if (!dept) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No department found",
                });
            }

            const existingUser = await db.query.user.findFirst({
                where: eq(user.email, email.toLowerCase()),
            });

            if (existingUser) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "User with this email already exists",
                });
            }

            const created = await db.transaction(async (tx) => {
                const userId = crypto.randomUUID();
                const password = randomHex();
                const hashFn = (await auth.$context).password.hash;
                const hashedPassword = await hashFn(password);

                await tx.insert(user).values({
                    id: userId,
                    email: email.toLowerCase(),
                    name,
                    role: "INSTRUCTOR",
                    emailVerified: true,
                    twoFactorEnabled: true,
                });

                await tx.insert(account).values({
                    userId,
                    accountId: userId,
                    providerId: "credential",
                    password: hashedPassword,
                });

                await tx.insert(twoFactor).values({
                    userId,
                    backupCodes: JSON.stringify([]),
                });

                const [createdInstructor] = await tx
                    .insert(instructor)
                    .values({
                        employeeId,
                        departmentId: dept.id,
                        userId,
                        designation,
                    })
                    .returning();

                return createdInstructor;
            });

            if (!created) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create instructor",
                });
            }

            await logAuditEvent({
                userId: currentUser.id,
                action: "CREATE",
                entityType: "INSTRUCTOR",
                entityId: created.id,
                after: created,
            });

            return created;
        }),

    update: adminProcedure
        .input(updateInstructorInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { id, departmentCode, email, name, designation, employeeId } =
                input;

            const { user: currentUser } = ctx.session;

            const existing = await db.query.instructor.findFirst({
                where: eq(instructor.id, id),
            });

            if (!existing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Instructor not found",
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

            const updated = db.transaction(async (tx) => {
                const [updatedInstructor] = await tx
                    .update(instructor)
                    .set({
                        ...(departmentId && { departmentId }),
                        ...(designation && { designation }),
                        ...(employeeId && { employeeId }),
                    })
                    .where(eq(instructor.id, id))
                    .returning();

                await tx
                    .update(user)
                    .set({
                        ...(email && { email }),
                        ...(name && { name }),
                    })
                    .where(eq(user.id, existing.userId))
                    .returning();

                return updatedInstructor;
            });

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update instructor",
                });
            }

            await logAuditEvent({
                userId: currentUser.id,
                action: "UPDATE",
                entityType: "INSTRUCTOR",
                entityId: id,
                before: existing,
                after: updated,
            });

            return updated;
        }),
});
