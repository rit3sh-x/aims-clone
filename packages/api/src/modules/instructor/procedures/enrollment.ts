import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import {
    approveEnrollmentInputSchema,
    rejectEnrollmentInputSchema,
} from "../schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { db, enrollment, courseOffering, logAuditEvent } from "@workspace/db";

export const enrollmentManagement = createTRPCRouter({
    approve: instructorProcedure
        .input(approveEnrollmentInputSchema)
        .mutation(async ({ input, ctx }) => {
            const instructorUserId = ctx.session.user.id;

            return db.transaction(async (tx) => {
                const record = await tx
                    .select({
                        enrollment,
                        offering: courseOffering,
                    })
                    .from(enrollment)
                    .innerJoin(
                        courseOffering,
                        eq(enrollment.offeringId, courseOffering.id)
                    )
                    .where(eq(enrollment.id, input.enrollmentId))
                    .then((r) => r[0]);

                if (!record)
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Enrollment not found",
                    });

                if (record.offering.instructorId !== instructorUserId)
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Not your course offering",
                    });

                if (record.enrollment.status !== "PENDING")
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Enrollment not pending instructor approval",
                    });

                const [updated] = await tx
                    .update(enrollment)
                    .set({
                        status: "INSTRUCTOR_APPROVED",
                        instructorApprovedAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .where(
                        and(
                            eq(enrollment.id, input.enrollmentId),
                            eq(enrollment.status, "PENDING")
                        )
                    )
                    .returning();

                if (!updated)
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "Enrollment state changed, retry",
                    });

                await logAuditEvent({
                    userId: instructorUserId,
                    action: "UPDATE",
                    entityType: "ENROLLMENT",
                    entityId: updated.id,
                    before: record.enrollment,
                    after: updated,
                });

                return updated;
            });
        }),

    reject: instructorProcedure
        .input(rejectEnrollmentInputSchema)
        .mutation(async ({ input, ctx }) => {
            const instructorUserId = ctx.session.user.id;

            return db.transaction(async (tx) => {
                const record = await tx
                    .select({
                        enrollment,
                        offering: courseOffering,
                    })
                    .from(enrollment)
                    .innerJoin(
                        courseOffering,
                        eq(enrollment.offeringId, courseOffering.id)
                    )
                    .where(eq(enrollment.id, input.enrollmentId))
                    .then((r) => r[0]);

                if (!record)
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Enrollment not found",
                    });

                if (record.offering.instructorId !== instructorUserId)
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Not your course offering",
                    });

                if (record.enrollment.status !== "INSTRUCTOR_REJECTED")
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Only pending enrollments can be rejected",
                    });

                const [updated] = await tx
                    .update(enrollment)
                    .set({
                        status: "INSTRUCTOR_REJECTED",
                        rejectedBy: instructorUserId,
                        rejectionReason: input.reason,
                        droppedAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .where(
                        and(
                            eq(enrollment.id, input.enrollmentId),
                            eq(enrollment.status, "PENDING")
                        )
                    )
                    .returning();

                if (!updated)
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "Enrollment state changed, retry",
                    });

                await logAuditEvent({
                    userId: instructorUserId,
                    action: "UPDATE",
                    entityType: "ENROLLMENT",
                    entityId: updated.id,
                    before: record.enrollment,
                    after: updated,
                });

                return updated;
            });
        }),
});
