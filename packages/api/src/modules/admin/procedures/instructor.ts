import { createTRPCRouter } from "@workspace/api/init";
import {
    createInstructorInputSchema,
    listInstructorsInputSchema,
    updateInstructorInputSchema,
} from "../schema";
import { adminProcedure } from "../middleware";
import { db, department, instructor, logAuditEvent } from "@workspace/db";
import { and, asc, eq, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { auth } from "@workspace/auth";
import { randomHex } from "../utils";

export const instructorManagement = createTRPCRouter({
    list: adminProcedure
        .input(listInstructorsInputSchema)
        .query(async ({ input }) => {
            const { page, pageSize, departmentCode, status, search } = input;

            let currentDepartment: typeof department.$inferSelect | null = null;

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

                currentDepartment = dept;
            }

            const conditions = [];

            if (currentDepartment)
                conditions.push(
                    eq(instructor.departmentId, currentDepartment.id)
                );
            if (status) conditions.push(eq(instructor.status, status));
            if (search)
                conditions.push(ilike(instructor.employeeId, `%${search}%`));

            const where = conditions.length ? and(...conditions) : undefined;

            const [items, total] = await Promise.all([
                db.query.instructor.findMany({
                    where,
                    with: {
                        user: true,
                        department: true,
                    },
                    orderBy: [asc(instructor.employeeId)],
                    limit: pageSize,
                    offset: (page - 1) * pageSize,
                }),
                db
                    .select({ count: sql<number>`count(*)` })
                    .from(instructor)
                    .where(where)
                    .then((r) => r[0]?.count ?? 0),
            ]);

            return {
                items,
                meta: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize),
                },
            };
        }),

    create: adminProcedure
        .input(createInstructorInputSchema)
        .mutation(async ({ input, ctx }) => {
            const {
                departmentCode,
                employeeId,
                status,
                designation,
                email,
                name,
            } = input;
            const { user } = ctx.session;
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
                    name: name,
                    role: "INSTRUCTOR",
                },
            });

            const [created] = await db
                .insert(instructor)
                .values({
                    departmentId: dept.code,
                    employeeId,
                    id: crypto.randomUUID(),
                    userId: newUser.id,
                    designation,
                    status,
                })
                .returning();

            if (!created) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create instructor",
                });
            }

            await logAuditEvent({
                userId: user.id,
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
            const { id, departmentCode, email, name, status, designation } =
                input;

            const { user } = ctx.session;
            const { headers } = ctx;

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

            const updateData: Partial<typeof instructor.$inferInsert> = {
                ...(departmentId && { departmentId }),
                ...(status && { status }),
                ...(designation && { designation }),
            };

            const [updated] = await db
                .update(instructor)
                .set(updateData)
                .where(eq(instructor.id, id))
                .returning();

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update instructor",
                });
            }

            if (email || name) {
                await auth.api.adminUpdateUser({
                    body: {
                        userId: existing.userId,
                        data: {
                            ...(email && { email }),
                            ...(name && { name }),
                        },
                    },
                    headers,
                });
            }

            await logAuditEvent({
                userId: user.id,
                action: "UPDATE",
                entityType: "INSTRUCTOR",
                entityId: id,
                before: existing,
                after: updated,
            });

            return updated;
        }),
});
