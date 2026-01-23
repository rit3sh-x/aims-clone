import { createTRPCRouter } from "@workspace/api/init";
import { studentProcedure } from "../middleware";
import {
    dropInputSchema,
    enrollInputSchema,
    listOfferingsInputSchema,
} from "../schema";
import {
    course,
    courseOffering,
    db,
    document,
    enrollment,
    logAuditEvent,
    offeringBatch,
    semester,
    student,
} from "@workspace/db";
import { and, asc, eq, gt, inArray, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { MAX_CREDITS_PER_SEMESTER } from "src/modules/constants";

export const offeringManagement = createTRPCRouter({
    list: studentProcedure
        .input(listOfferingsInputSchema)
        .query(async ({ input, ctx }) => {
            const studentUserId = ctx.session.user.id;
            const { pageSize, cursor } = input;

            const currentSemester = await db.query.semester.findFirst({
                where: (s, { eq }) => eq(s.status, "ONGOING"),
            });

            if (!currentSemester) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "No currently running semester",
                });
            }

            const studentRecord = await db.query.student.findFirst({
                where: eq(student.userId, studentUserId),
            });

            if (!studentRecord) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Student record not found",
                });
            }

            const rows = await db
                .select({
                    offering: courseOffering,
                    course,
                    semester,
                })
                .from(courseOffering)
                .innerJoin(course, eq(courseOffering.courseId, course.id))
                .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
                .innerJoin(
                    offeringBatch,
                    eq(offeringBatch.offeringId, courseOffering.id)
                )
                .where(
                    and(
                        eq(courseOffering.semesterId, currentSemester.id),
                        eq(courseOffering.status, "ENROLLING"),
                        eq(offeringBatch.batchId, studentRecord.batchId),
                        cursor ? gt(courseOffering.id, cursor) : undefined
                    )
                )
                .orderBy(asc(courseOffering.id))
                .limit(pageSize + 1);

            const hasNextPage = rows.length > pageSize;
            const items = hasNextPage ? rows.slice(0, pageSize) : rows;

            const nextCursor = hasNextPage
                ? { id: items[items.length - 1]!.offering.id }
                : null;

            return {
                items,
                nextCursor,
                hasNextPage,
            };
        }),

    enroll: studentProcedure
        .input(enrollInputSchema)
        .mutation(async ({ input, ctx }) => {
            const studentUserId = ctx.session.user.id;
            const { offeringId } = input;

            return db.transaction(async (tx) => {
                const studentRecord = await tx.query.student.findFirst({
                    where: eq(student.userId, studentUserId),
                });

                if (!studentRecord) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Student record not found",
                    });
                }

                const record = await tx
                    .select({
                        offering: courseOffering,
                        course,
                        semester,
                    })
                    .from(courseOffering)
                    .innerJoin(course, eq(courseOffering.courseId, course.id))
                    .innerJoin(
                        semester,
                        eq(courseOffering.semesterId, semester.id)
                    )
                    .where(eq(courseOffering.id, offeringId))
                    .then((r) => r[0]);

                if (!record) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Offering not found",
                    });
                }

                if (record.offering.status !== "ENROLLING") {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Offering is not open for enrollment",
                    });
                }

                if (new Date() > new Date(record.semester.enrollmentDeadline)) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Enrollment deadline has passed",
                    });
                }

                const currentCredits = await tx
                    .select({
                        total: sql<number>`COALESCE(SUM(${course.credits}), 0)`,
                    })
                    .from(enrollment)
                    .innerJoin(
                        courseOffering,
                        eq(enrollment.offeringId, courseOffering.id)
                    )
                    .innerJoin(course, eq(courseOffering.courseId, course.id))
                    .where(
                        and(
                            eq(enrollment.studentId, studentRecord.id),
                            eq(
                                courseOffering.semesterId,
                                record.offering.semesterId
                            ),
                            inArray(enrollment.status, [
                                "PENDING",
                                "INSTRUCTOR_APPROVED",
                                "ADVISOR_APPROVED",
                                "ENROLLED",
                            ])
                        )
                    )
                    .then((r) => Number(r[0]?.total ?? 0));

                if (
                    currentCredits + record.course.credits >
                    MAX_CREDITS_PER_SEMESTER
                ) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Credit limit exceeded. Max allowed is ${MAX_CREDITS_PER_SEMESTER}`,
                    });
                }

                const [created] = await tx
                    .insert(enrollment)
                    .values({
                        studentId: studentRecord.id,
                        offeringId,
                        status: "PENDING",
                    })
                    .returning();

                if (!created) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to enroll",
                    });
                }

                await logAuditEvent({
                    userId: studentUserId,
                    action: "ENROLL",
                    entityType: "ENROLLMENT",
                    entityId: created.id,
                    after: created,
                });

                return created;
            });
        }),

    drop: studentProcedure
        .input(dropInputSchema)
        .mutation(async ({ input, ctx }) => {
            const studentUserId = ctx.session.user.id;
            const { enrollmentId } = input;

            const studentRecord = await db.query.student.findFirst({
                where: eq(student.userId, studentUserId),
            });

            if (!studentRecord) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Student record not found",
                });
            }

            const [updated] = await db
                .update(enrollment)
                .set({
                    status: "DROPPED",
                    updatedAt: new Date(),
                })
                .where(
                    and(
                        eq(enrollment.id, enrollmentId),
                        eq(enrollment.studentId, studentRecord.id)
                    )
                )
                .returning();

            if (!updated) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Enrollment not found",
                });
            }

            await logAuditEvent({
                userId: studentUserId,
                action: "UNENROLL",
                entityType: "ENROLLMENT",
                entityId: updated.id,
                after: updated,
            });

            return updated;
        }),
});
