import { and, eq, desc, lt, or, type SQL } from "drizzle-orm";
import { createTRPCRouter } from "@workspace/api/init";
import { advisorProcedure } from "../middleware";
import { db, student, batch, enrollment, logAuditEvent } from "@workspace/db";
import { TRPCError } from "@trpc/server";
import {
    approveEnrollmentInputSchema,
    listEnrollmentsInputSchema,
    rejectEnrollmentInputSchema,
} from "../schema";

export const enrollmentManagement = createTRPCRouter({
    list: advisorProcedure
        .input(listEnrollmentsInputSchema)
        .query(async ({ input, ctx }) => {
            const { id: advisorId } = ctx.advisor;
            const { pageSize, cursor, status } = input;

            const conditions: SQL[] = [eq(student.advisorId, advisorId)];

            if (status) {
                conditions.push(eq(enrollment.status, status));
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

    approveEnrollment: advisorProcedure
        .input(approveEnrollmentInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { enrollmentId } = input;
            const { id: advisorId } = ctx.advisor;

            const record = await db
                .select({
                    enrollment,
                    student,
                })
                .from(enrollment)
                .innerJoin(student, eq(enrollment.studentId, student.id))
                .where(eq(enrollment.id, enrollmentId))
                .limit(1)
                .then((r) => r[0]);

            if (!record || record.student.advisorId !== advisorId) {
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
                .set({
                    status: "ADVISOR_APPROVED",
                    advisorApprovedAt: new Date(),
                })
                .where(eq(enrollment.id, enrollmentId))
                .returning();

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to approve enrollment",
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

    rejectEnrollment: advisorProcedure
        .input(rejectEnrollmentInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { enrollmentId, reason } = input;
            const { id: advisorId } = ctx.advisor;

            const record = await db
                .select({
                    enrollment,
                    student,
                })
                .from(enrollment)
                .innerJoin(student, eq(enrollment.studentId, student.id))
                .where(eq(enrollment.id, enrollmentId))
                .limit(1)
                .then((r) => r[0]);

            if (!record || record.student.advisorId !== advisorId) {
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
