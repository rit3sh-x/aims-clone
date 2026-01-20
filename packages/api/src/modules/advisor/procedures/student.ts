import { z } from "zod";
import { and, eq, desc, sql, ilike, or, type SQL } from "drizzle-orm";
import { createTRPCRouter } from "@workspace/api/init";
import { advisorProcedure } from "../middleware";
import {
    db,
    student,
    batch,
    user,
    enrollment,
    courseOffering,
    course,
    semester,
    logAuditEvent,
    program,
    department,
} from "@workspace/db";
import { TRPCError } from "@trpc/server";
import {
    approveEnrollmentInputSchema,
    getOneStudentByIdInputSchema,
    listStudentsInputSchema,
    rejectEnrollmentInputSchema,
} from "../schema";

export const studentManagement = createTRPCRouter({
    listStudents: advisorProcedure
        .input(listStudentsInputSchema)
        .query(async ({ input, ctx }) => {
            const {
                page,
                pageSize,
                search,
                year,
                programCode,
                departmentCode,
                status,
            } = input;

            const advisorId = ctx.session.user.id;
            const limit = pageSize;
            const offset = (page - 1) * pageSize;

            const conditions: SQL[] = [eq(batch.advisorId, advisorId)];
            conditions.push(eq(user.disabled, false));

            if (year) conditions.push(eq(batch.year, year));
            if (status) conditions.push(eq(student.status, status));
            if (programCode) conditions.push(eq(program.code, programCode));
            if (departmentCode)
                conditions.push(eq(department.code, departmentCode));

            if (search) {
                const searchCondition = or(
                    ilike(student.rollNo, `%${search}%`),
                    ilike(user.name, `%${search}%`),
                    ilike(user.email, `%${search}%`)
                );

                if (searchCondition) {
                    conditions.push(searchCondition);
                }
            }

            const where = and(...conditions);

            const [items, total] = await Promise.all([
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
                    .limit(limit)
                    .offset(offset),

                db
                    .select({ count: sql<number>`count(*)` })
                    .from(student)
                    .innerJoin(batch, eq(student.batchId, batch.id))
                    .innerJoin(program, eq(batch.programId, program.id))
                    .innerJoin(
                        department,
                        eq(program.departmentId, department.id)
                    )
                    .innerJoin(user, eq(student.userId, user.id))
                    .where(where)
                    .then((r) => r[0]?.count ?? 0),
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                items,
                meta: {
                    page,
                    pageSize: limit,
                    total,
                    totalPages,
                    hasNextPage: page < totalPages,
                },
            };
        }),

    getOne: advisorProcedure
        .input(getOneStudentByIdInputSchema)
        .query(async ({ input, ctx }) => {
            const { studentId } = input;
            const advisorId = ctx.session.user.id;

            const record = await db
                .select({
                    student,
                    user,
                    batch,
                })
                .from(student)
                .innerJoin(user, eq(student.userId, user.id))
                .innerJoin(batch, eq(student.batchId, batch.id))
                .where(
                    and(
                        eq(student.id, studentId),
                        eq(batch.advisorId, advisorId)
                    )
                )
                .limit(1)
                .then((r) => r[0]);

            if (!record) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Student not found or not under your advisory",
                });
            }

            const enrollments = await db
                .select({
                    enrollment,
                    offering: courseOffering,
                    course,
                    semester,
                })
                .from(enrollment)
                .innerJoin(
                    courseOffering,
                    eq(enrollment.offeringId, courseOffering.id)
                )
                .innerJoin(course, eq(courseOffering.courseId, course.id))
                .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
                .where(eq(enrollment.studentId, studentId));

            return {
                ...record,
                enrollments,
            };
        }),

    approveEnrollment: advisorProcedure
        .input(approveEnrollmentInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { enrollmentId } = input;
            const advisorId = ctx.session.user.id;

            const record = await db
                .select({
                    enrollment,
                    batch,
                })
                .from(enrollment)
                .innerJoin(student, eq(enrollment.studentId, student.id))
                .innerJoin(batch, eq(student.batchId, batch.id))
                .where(eq(enrollment.id, enrollmentId))
                .limit(1)
                .then((r) => r[0]);

            if (!record || record.batch.advisorId !== advisorId) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Not authorized to approve this enrollment",
                });
            }

            if (record.enrollment.status !== "INSTRUCTOR_APPROVED") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Enrollment is not awaiting advisor approval",
                });
            }

            const [updated] = await db
                .update(enrollment)
                .set({ status: "ADVISOR_APPROVED" })
                .where(eq(enrollment.id, enrollmentId))
                .returning();

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to approve enrollment",
                });
            }

            await logAuditEvent({
                userId: advisorId,
                action: "ENROLL",
                entityType: "ENROLLMENT",
                entityId: updated.id,
                after: updated,
            });

            return updated;
        }),

    rejectEnrollment: advisorProcedure
        .input(rejectEnrollmentInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { enrollmentId, reason } = input;
            const advisorId = ctx.session.user.id;

            const record = await db
                .select({
                    enrollment,
                    batch,
                })
                .from(enrollment)
                .innerJoin(student, eq(enrollment.studentId, student.id))
                .innerJoin(batch, eq(student.batchId, batch.id))
                .where(eq(enrollment.id, enrollmentId))
                .limit(1)
                .then((r) => r[0]);

            if (!record || record.batch.advisorId !== advisorId) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Not authorized to reject this enrollment",
                });
            }

            if (record.enrollment.status !== "INSTRUCTOR_APPROVED") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Enrollment is not awaiting advisor approval",
                });
            }

            const [updated] = await db
                .update(enrollment)
                .set({
                    status: "ADVISOR_REJECTED",
                    droppedAt: new Date(),
                })
                .where(eq(enrollment.id, enrollmentId))
                .returning();

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to reject enrollment",
                });
            }

            await logAuditEvent({
                userId: advisorId,
                action: "UNENROLL",
                entityType: "ENROLLMENT",
                entityId: updated.id,
                after: {
                    ...updated,
                    reason: reason,
                },
            });

            return updated;
        }),
});
