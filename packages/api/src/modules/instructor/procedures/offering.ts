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
    logAuditEvent,
    offeringBatch,
    prerequisite,
} from "@workspace/db";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, lt, or, type SQL } from "drizzle-orm";

export const offeringManagement = createTRPCRouter({
    propose: instructorProcedure
        .input(proposeOfferingInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { instructor: currentInstructor } = ctx;
            const {
                courseId,
                assessmentTemplates,
                batchIds,
                prerequisiteCourseIds,
                instructorIds,
            } = input;

            const courseRecord = await db
                .select({
                    id: course.id,
                    status: course.status,
                })
                .from(course)
                .where(eq(course.id, courseId))
                .then((r) => r[0]);

            if (!courseRecord) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Course not found",
                });
            }

            if (courseRecord.status !== "ADMIN_ACCEPTED") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Only ADMIN_ACCEPTED courses can be offered",
                });
            }

            const totalWeightage = assessmentTemplates.reduce(
                (sum, t) => sum + t.weightage,
                0
            );

            if (totalWeightage !== 100) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Total assessment weightage must equal 100%",
                });
            }

            const currentSemester = await db.query.semester.findFirst({
                where: (s, { or, eq }) =>
                    or(eq(s.status, "ONGOING"), eq(s.status, "UPCOMING")),
                orderBy: (s, { asc }) => asc(s.startDate),
            });

            if (!currentSemester) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "No active or upcoming semester available",
                });
            }

            return db.transaction(async (tx) => {
                const existingOffering = await tx
                    .select({
                        id: courseOffering.id,
                        status: courseOffering.status,
                    })
                    .from(courseOffering)
                    .where(
                        and(
                            eq(courseOffering.courseId, courseId),
                            eq(courseOffering.semesterId, currentSemester.id)
                        )
                    )
                    .then((r) => r[0]);

                if (
                    existingOffering &&
                    existingOffering.status !== "REJECTED"
                ) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message:
                            "Offering already exists for this course in the current semester",
                    });
                }

                const [offering] = await tx
                    .insert(courseOffering)
                    .values({
                        courseId,
                        semesterId: currentSemester.id,
                        status: "PROPOSED",
                    })
                    .returning();

                if (!offering) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create course offering",
                    });
                }

                await tx.insert(courseOfferingInstructor).values({
                    offeringId: offering.id,
                    instructorId: currentInstructor.id,
                    isHead: true,
                });

                if (instructorIds.length > 0) {
                    await tx.insert(courseOfferingInstructor).values(
                        instructorIds.map((instructorId) => ({
                            offeringId: offering.id,
                            instructorId,
                            isHead: false,
                        }))
                    );
                }

                if (batchIds.length > 0) {
                    await tx.insert(offeringBatch).values(
                        batchIds.map((batchId) => ({
                            offeringId: offering.id,
                            batchId,
                        }))
                    );
                }

                if (prerequisiteCourseIds.length > 0) {
                    await tx.insert(prerequisite).values(
                        prerequisiteCourseIds.map((prereqId) => ({
                            courseId,
                            prerequisiteCourseId: prereqId,
                        }))
                    );
                }

                if (assessmentTemplates.length > 0) {
                    await tx.insert(assessmentTemplate).values(
                        assessmentTemplates.map((template) => ({
                            offeringId: offering.id,
                            type: template.type,
                            maxMarks: template.maxMarks,
                            weightage: template.weightage,
                        }))
                    );
                }

                await logAuditEvent({
                    userId: ctx.session.user.id,
                    action: "CREATE",
                    entityType: "COURSE_OFFERING",
                    entityId: offering.id,
                    after: {
                        offering,
                        headInstructorId: currentInstructor.id,
                        instructorIds,
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
                    course,
                })
                .from(courseOffering)
                .innerJoin(course, eq(courseOffering.courseId, course.id))
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
