import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import {
    listInstructorOfferingsInputSchema,
    proposeOfferingInputSchema,
} from "../schema";
import {
    assessmentTemplate,
    course,
    courseOffering,
    courseOfferingInstructor,
    db,
    instructor,
    logAuditEvent,
    offeringBatch,
    prerequisite,
} from "@workspace/db";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, inArray, lt, or, type SQL } from "drizzle-orm";

export const offeringManagement = createTRPCRouter({
    propose: instructorProcedure
        .input(proposeOfferingInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { instructor: currentInstructor } = ctx;

            const {
                courseId,
                semesterId,
                batchIds,
                instructorIds,
                headInstructorId,
                prerequisiteCourseIds,
                assessmentTemplates,
            } = input;

            if (headInstructorId !== currentInstructor.id) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only the head instructor can propose an offering",
                });
            }

            if (!instructorIds.includes(headInstructorId)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "Head instructor must be included in instructorIds",
                });
            }

            const courseRecord = await db
                .select({ status: course.status })
                .from(course)
                .where(eq(course.id, courseId))
                .then((r) => r[0]);

            if (!courseRecord || courseRecord.status !== "ADMIN_ACCEPTED") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Only ACTIVE courses can be offered",
                });
            }

            const instructors = await db
                .select({ id: instructor.id })
                .from(instructor)
                .where(inArray(instructor.id, instructorIds));

            if (instructors.length !== instructorIds.length) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid instructor list",
                });
            }

            const totalWeightage = assessmentTemplates.reduce(
                (sum, t) => sum + t.weightage,
                0
            );

            if (totalWeightage !== 100) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Total assessment weightage must be exactly 100",
                });
            }

            return db.transaction(async (tx) => {
                const exists = await tx
                    .select({ id: courseOffering.id })
                    .from(courseOffering)
                    .where(
                        and(
                            eq(courseOffering.courseId, courseId),
                            eq(courseOffering.semesterId, semesterId)
                        )
                    )
                    .then((r) => r[0]);

                if (exists) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message:
                            "Offering already exists for this course and semester",
                    });
                }

                const [offering] = await tx
                    .insert(courseOffering)
                    .values({
                        courseId,
                        semesterId,
                        status: "PROPOSED",
                    })
                    .returning();

                if (!offering) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create course offering",
                    });
                }

                await tx.insert(courseOfferingInstructor).values(
                    instructorIds.map((id) => ({
                        offeringId: offering.id,
                        instructorId: id,
                        isHead: id === headInstructorId,
                    }))
                );

                await tx.insert(offeringBatch).values(
                    batchIds.map((batchId) => ({
                        offeringId: offering.id,
                        batchId,
                    }))
                );

                await tx.insert(assessmentTemplate).values(
                    assessmentTemplates.map((template) => ({
                        ...template,
                        offeringId: offering.id,
                    }))
                );

                if (prerequisiteCourseIds.length > 0) {
                    await tx
                        .insert(prerequisite)
                        .values(
                            prerequisiteCourseIds.map((prereqId) => ({
                                courseId,
                                prerequisiteCourseId: prereqId,
                            }))
                        )
                        .onConflictDoNothing();
                }

                await logAuditEvent({
                    userId: ctx.session.user.id,
                    action: "CREATE",
                    entityType: "COURSE_OFFERING",
                    entityId: offering.id,
                    after: {
                        offering,
                        instructorIds,
                        headInstructorId,
                        batchIds,
                        prerequisiteCourseIds,
                        assessmentTemplates,
                    },
                });

                return offering;
            });
        }),

    list: instructorProcedure
        .input(listInstructorOfferingsInputSchema)
        .query(async ({ input, ctx }) => {
            const { instructor } = ctx;
            const { pageSize, cursor, status } = input;

            const conditions: SQL[] = [
                eq(courseOfferingInstructor.instructorId, instructor.id),
            ];

            if (status) {
                conditions.push(eq(courseOffering.status, status));
            }

            if (cursor) {
                const cursorCondition = or(
                    lt(courseOffering.createdAt, cursor.createdAt),
                    and(
                        eq(courseOffering.createdAt, cursor.createdAt),
                        lt(courseOffering.id, cursor.id)
                    )
                );

                if (cursorCondition) {
                    conditions.push(cursorCondition);
                }
            }

            const rows = await db
                .select({
                    offering: courseOffering,
                })
                .from(courseOffering)
                .innerJoin(
                    courseOfferingInstructor,
                    eq(courseOfferingInstructor.offeringId, courseOffering.id)
                )
                .where(and(...conditions))
                .orderBy(
                    desc(courseOffering.createdAt),
                    desc(courseOffering.id)
                )
                .limit(pageSize + 1);

            const hasNextPage = rows.length > pageSize;
            const items = hasNextPage ? rows.slice(0, pageSize) : rows;

            const nextCursor = hasNextPage
                ? {
                      createdAt: items[items.length - 1]!.offering.createdAt,
                      id: items[items.length - 1]!.offering.id,
                  }
                : null;

            return {
                items,
                nextCursor,
                hasNextPage,
            };
        }),
});
