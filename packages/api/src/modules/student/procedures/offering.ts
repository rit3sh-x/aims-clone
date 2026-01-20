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
import { and, asc, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const offeringManagement = createTRPCRouter({
    list: studentProcedure
        .input(listOfferingsInputSchema)
        .query(async ({ input, ctx }) => {
            const studentId = ctx.session.user.id;
            const { semesterId, page, pageSize } = input;

            const offset = (page - 1) * pageSize;

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
                .innerJoin(student, eq(student.batchId, offeringBatch.batchId))
                .where(
                    and(
                        eq(courseOffering.semesterId, semesterId),
                        eq(courseOffering.status, "ENROLLING"),
                        eq(student.id, studentId)
                    )
                )
                .limit(pageSize + 1)
                .offset(offset)
                .orderBy(asc(courseOffering.id));

            const hasNextPage = rows.length > pageSize;

            return {
                data: hasNextPage ? rows.slice(0, pageSize) : rows,
                page,
                pageSize,
                hasNextPage,
            };
        }),
    enroll: studentProcedure
        .input(enrollInputSchema)
        .mutation(async ({ input, ctx }) => {
            const studentId = ctx.session.user.id;
            const userId = ctx.session.user.id;
            const { offeringId, type } = input;

            return db.transaction(async (tx) => {
                const record = await tx
                    .select({
                        offering: courseOffering,
                        semester,
                    })
                    .from(courseOffering)
                    .innerJoin(
                        semester,
                        eq(courseOffering.semesterId, semester.id)
                    )
                    .where(eq(courseOffering.id, offeringId))
                    .then((r) => r[0]);

                if (!record)
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Offering not found",
                    });

                if (record.offering.status !== "ENROLLING")
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Offering not open",
                    });

                if (new Date() > new Date(record.semester.enrollmentDeadline))
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Enrollment deadline passed",
                    });

                const feeProof = await tx.query.document.findFirst({
                    where: and(
                        eq(document.userId, userId),
                        eq(document.type, "FEES_DOCUMENT")
                    ),
                });

                if (!feeProof)
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Upload fee proof before enrolling",
                    });

                const result = await tx
                    .select({ count: sql<number>`count(*)` })
                    .from(enrollment)
                    .where(
                        and(
                            eq(enrollment.offeringId, offeringId),
                            eq(enrollment.status, "ENROLLED")
                        )
                    );

                const count = Number(result[0]?.count ?? 0);

                if (count >= record.offering.maxCapacity)
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Offering is full",
                    });

                const [created] = await tx
                    .insert(enrollment)
                    .values({
                        id: crypto.randomUUID(),
                        studentId,
                        offeringId: offeringId,
                        status: "PENDING",
                        type,
                    })
                    .returning();

                if (!created) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to enroll in course",
                    });
                }

                await logAuditEvent({
                    userId,
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
            const studentId = ctx.session.user.id;
            const { enrollmentId } = input;

            const [updated] = await db
                .update(enrollment)
                .set({
                    status: "DROPPED",
                    droppedAt: new Date(),
                })
                .where(
                    and(
                        eq(enrollment.id, enrollmentId),
                        eq(enrollment.studentId, studentId)
                    )
                )
                .returning();

            if (!updated)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Enrollment not found",
                });

            await logAuditEvent({
                userId: ctx.session.user.id,
                action: "UNENROLL",
                entityType: "ENROLLMENT",
                entityId: updated.id,
                after: updated,
            });

            return updated;
        }),
});
