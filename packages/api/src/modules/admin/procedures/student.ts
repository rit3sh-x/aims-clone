import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    createManyStudentsInputSchema,
    disableStudentInputSchema,
    getStudentByIdSchema,
    listStudentsInputSchema,
    updateStudentInputSchema,
} from "../schema";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import {
    batch,
    db,
    department,
    logAuditEvent,
    program,
    student,
    user,
} from "@workspace/db";
import { randomHex } from "../utils";
import { auth } from "@workspace/auth";
import { TRPCError } from "@trpc/server";

export const studentManagement = createTRPCRouter({
    list: adminProcedure
        .input(listStudentsInputSchema)
        .query(async ({ input }) => {
            const {
                page,
                pageSize,
                departmentCode,
                programCode,
                search,
                status,
                year,
            } = input;

            const limit = pageSize;
            const offset = (page - 1) * pageSize;

            const conditions = [];

            if (search) {
                conditions.push(ilike(student.rollNo, `%${search}%`));
            }

            if (status) {
                conditions.push(eq(student.status, status));
            }

            if (year) {
                conditions.push(eq(batch.year, year));
            }

            if (programCode) {
                conditions.push(eq(program.code, programCode));
            }

            if (departmentCode) {
                conditions.push(eq(department.code, departmentCode));
            }

            conditions.push(eq(user.disabled, false));

            const where = conditions.length ? and(...conditions) : undefined;

            const [rows, total] = await Promise.all([
                db
                    .select({
                        student,
                        user,
                        batch,
                        program,
                        department,
                    })
                    .from(student)
                    .innerJoin(user, eq(student.userId, user.id))
                    .innerJoin(batch, eq(student.batchId, batch.id))
                    .innerJoin(program, eq(batch.programId, program.id))
                    .innerJoin(
                        department,
                        eq(program.departmentId, department.id)
                    )
                    .where(where)
                    .orderBy(desc(student.createdAt))
                    .limit(limit + 1)
                    .offset(offset),

                db
                    .select({ count: sql<number>`count(*)` })
                    .from(student)
                    .innerJoin(user, eq(student.userId, user.id))
                    .innerJoin(batch, eq(student.batchId, batch.id))
                    .innerJoin(program, eq(batch.programId, program.id))
                    .innerJoin(
                        department,
                        eq(program.departmentId, department.id)
                    )
                    .where(where)
                    .then((r) => r[0]?.count ?? 0),
            ]);

            const hasNextPage = rows.length > limit;
            const students = hasNextPage ? rows.slice(0, limit) : rows;

            return {
                students,
                page,
                pageSize: limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage,
            };
        }),

    getOne: adminProcedure
        .input(getStudentByIdSchema)
        .query(async ({ input }) => {
            const { id } = input;

            const result = await db
                .select({
                    student,
                    user,
                    batch,
                    program,
                    department,
                })
                .from(student)
                .innerJoin(user, eq(student.userId, user.id))
                .innerJoin(batch, eq(student.batchId, batch.id))
                .innerJoin(program, eq(batch.programId, program.id))
                .innerJoin(department, eq(program.departmentId, department.id))
                .where(and(eq(student.id, id), eq(user.disabled, false)))
                .limit(1)
                .then((r) => r[0]);

            if (!result) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Student not found",
                });
            }

            return result;
        }),

    createMany: adminProcedure
        .input(createManyStudentsInputSchema)
        .mutation(async ({ input, ctx }) => {
            const created: Array<{
                student: typeof student.$inferSelect;
                password: string;
            }> = [];

            const failed: Array<{
                row: (typeof input)[number];
                reason: string;
            }> = [];

            for (const row of input) {
                try {
                    const programRecord = await db.query.program.findFirst({
                        where: eq(program.code, row.programCode),
                    });

                    if (!programRecord) {
                        failed.push({ row, reason: "Program not found" });
                        continue;
                    }

                    const batchRecord = await db.query.batch.findFirst({
                        where: and(
                            eq(batch.programId, programRecord.id),
                            eq(batch.year, row.year)
                        ),
                    });

                    if (!batchRecord) {
                        failed.push({
                            row,
                            reason: "Batch not found for given program and year",
                        });
                        continue;
                    }

                    const password = randomHex();

                    const { user: newUser } = await auth.api.createUser({
                        body: {
                            email: row.email,
                            password,
                            name: row.name,
                            role: "STUDENT",
                        },
                    });

                    const studentRecord = await db.query.student.findFirst({
                        where: (s, { eq }) => eq(s.id, newUser.id),
                    });

                    if (studentRecord) {
                        created.push({
                            student: studentRecord,
                            password,
                        });
                    } else {
                        failed.push({
                            row,
                            reason: "Unexpected error during creation",
                        });
                    }
                } catch (err) {
                    failed.push({
                        row,
                        reason: "Unexpected error during creation",
                    });
                }
            }

            await logAuditEvent({
                userId: ctx.session.user.id,
                action: "CREATE",
                entityType: "STUDENT",
                after: {
                    createdCount: created.length,
                    failedCount: failed.length,
                    studentIds: created.map((c) => c.student.id),
                },
            });

            return {
                created,
                failed,
            };
        }),

    update: adminProcedure
        .input(updateStudentInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { id, ...data } = input;

            const before = await db.query.student.findFirst({
                where: eq(student.id, id),
            });

            if (!before) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Student not found",
                });
            }

            const [after] = await db
                .update(student)
                .set(data)
                .where(eq(student.id, id))
                .returning();

            if (!after) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update student",
                });
            }

            await logAuditEvent({
                userId: ctx.session.user.id,
                action: "UPDATE",
                entityType: "STUDENT",
                entityId: id,
                before,
                after,
            });

            return after;
        }),

    disable: adminProcedure
        .input(disableStudentInputSchema)
        .mutation(async ({ input, ctx }) => {
            const studentRecord = await db.query.student.findFirst({
                where: eq(student.id, input.studentId),
            });

            if (!studentRecord) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Student not found",
                });
            }

            const beforeUser = await db.query.user.findFirst({
                where: eq(user.id, studentRecord.userId),
            });

            if (!beforeUser || beforeUser.disabled) {
                return;
            }

            const [afterUser] = await db
                .update(user)
                .set({ disabled: true })
                .where(eq(user.id, studentRecord.userId))
                .returning();

            await logAuditEvent({
                userId: ctx.session.user.id,
                action: "DISABLE",
                entityType: "USER",
                entityId: studentRecord.userId,
                before: beforeUser,
                after: afterUser,
            });
        }),
});
