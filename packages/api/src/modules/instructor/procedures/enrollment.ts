import { and, eq, desc, lt, or, type SQL } from "drizzle-orm";
import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import {
    db,
    student,
    enrollment,
    logAuditEvent,
    courseOfferingInstructor,
    course,
    courseOffering,
} from "@workspace/db";
import { TRPCError } from "@trpc/server";
import {
    approveEnrollmentInputSchema,
    listEnrollmentsInputSchema,
    rejectEnrollmentInputSchema,
} from "../schema";

export const enrollmentManagement = createTRPCRouter({
    list: instructorProcedure
        .input(listEnrollmentsInputSchema)
        .query(async ({ input, ctx }) => {
            const { id: instructorId } = ctx.instructor;
            const { pageSize, cursor, courseCode } = input;

            const conditions: SQL[] = [
                eq(courseOfferingInstructor.instructorId, instructorId),
                eq(courseOfferingInstructor.isHead, true),
            ];

            if (courseCode) {
                conditions.push(eq(course.code, courseCode));
            }

            if (cursor) {
                const cursorCondition = or(
                    lt(enrollment.createdAt, cursor.createdAt),
                    and(
                        eq(enrollment.createdAt, cursor.createdAt),
                        lt(enrollment.id, cursor.id)
                    )
                );

                if (cursorCondition) {
                    conditions.push(cursorCondition);
                }
            }

            const rows = await db
                .select({
                    enrollment,
                    student,
                })
                .from(enrollment)
                .innerJoin(
                    courseOffering,
                    eq(enrollment.offeringId, courseOffering.id)
                )
                .innerJoin(
                    courseOfferingInstructor,
                    eq(courseOfferingInstructor.offeringId, courseOffering.id)
                )
                .innerJoin(course, eq(courseOffering.courseId, course.id))
                .innerJoin(student, eq(enrollment.studentId, student.id))
                .where(and(...conditions))
                .orderBy(desc(enrollment.createdAt), desc(enrollment.id))
                .limit(pageSize + 1);

            const hasNextPage = rows.length > pageSize;
            const items = hasNextPage ? rows.slice(0, pageSize) : rows;

            const nextCursor = hasNextPage
                ? {
                      createdAt: items[items.length - 1]!.enrollment.createdAt,
                      id: items[items.length - 1]!.enrollment.id,
                  }
                : null;

            return {
                items,
                nextCursor,
                hasNextPage,
                total: items.length,
            };
        }),

    approve: instructorProcedure
        .input(approveEnrollmentInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { enrollmentId } = input;
            const { id: instructorId } = ctx.instructor;

            const record = await db
                .select({ enrollment })
                .from(enrollment)
                .innerJoin(
                    courseOffering,
                    eq(enrollment.offeringId, courseOffering.id)
                )
                .innerJoin(
                    courseOfferingInstructor,
                    eq(courseOfferingInstructor.offeringId, courseOffering.id)
                )
                .where(
                    and(
                        eq(enrollment.id, enrollmentId),
                        eq(courseOfferingInstructor.instructorId, instructorId),
                        eq(courseOfferingInstructor.isHead, true)
                    )
                )
                .limit(1)
                .then((r) => r[0]);

            if (!record) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only the head instructor can approve enrollments",
                });
            }

            if (record.enrollment.status !== "PENDING") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Enrollment is not awaiting instructor approval",
                });
            }

            const [updated] = await db
                .update(enrollment)
                .set({
                    status: "INSTRUCTOR_APPROVED",
                    instructorApprovedAt: new Date(),
                })
                .where(eq(enrollment.id, enrollmentId))
                .returning();

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to accept the enrollment",
                });
            }

            await logAuditEvent({
                userId: ctx.session.user.id,
                action: "ENROLL",
                entityType: "ENROLLMENT",
                entityId: updated.id,
                after: updated,
            });

            return updated;
        }),

    reject: instructorProcedure
        .input(rejectEnrollmentInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { enrollmentId, reason } = input;
            const { id: instructorId } = ctx.instructor;

            const record = await db
                .select({ enrollment })
                .from(enrollment)
                .innerJoin(
                    courseOffering,
                    eq(enrollment.offeringId, courseOffering.id)
                )
                .innerJoin(
                    courseOfferingInstructor,
                    eq(courseOfferingInstructor.offeringId, courseOffering.id)
                )
                .where(
                    and(
                        eq(enrollment.id, enrollmentId),
                        eq(courseOfferingInstructor.instructorId, instructorId),
                        eq(courseOfferingInstructor.isHead, true) // 🔑
                    )
                )
                .limit(1)
                .then((r) => r[0]);

            if (!record) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only the head instructor can reject enrollments",
                });
            }

            if (record.enrollment.status !== "PENDING") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Enrollment is not awaiting instructor approval",
                });
            }

            const [updated] = await db
                .update(enrollment)
                .set({
                    status: "INSTRUCTOR_REJECTED",
                })
                .where(eq(enrollment.id, enrollmentId))
                .returning();

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to reject the enrollment",
                });
            }

            await logAuditEvent({
                userId: ctx.session.user.id,
                action: "UNENROLL",
                entityType: "ENROLLMENT",
                entityId: updated.id,
                after: {
                    ...updated,
                    reason,
                },
            });

            return updated;
        }),
});
