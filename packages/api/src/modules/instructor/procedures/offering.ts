import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import {
    listInstructorOfferingsInputSchema,
    proposeOfferingInputSchema,
} from "../schema";
import {
    courseOffering,
    db,
    logAuditEvent,
    offeringBatch,
    prerequisite,
} from "@workspace/db";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";

export const offeringManagement = createTRPCRouter({
    propose: instructorProcedure
        .input(proposeOfferingInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { user } = ctx.session;
            const {
                batchIds,
                courseId,
                maxCapacity,
                semesterId,
                prerequisiteCourseIds,
            } = input;

            return db.transaction(async (tx) => {
                const [offering] = await tx
                    .insert(courseOffering)
                    .values({
                        id: crypto.randomUUID(),
                        courseId,
                        semesterId,
                        instructorId: user.id,
                        maxCapacity,
                        status: "PROPOSED",
                    })
                    .returning();

                if (!offering) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create course offering",
                    });
                }

                await tx.insert(offeringBatch).values(
                    batchIds.map((batchId) => ({
                        id: crypto.randomUUID(),
                        offeringId: offering.id,
                        batchId,
                    }))
                );

                if (prerequisiteCourseIds.length > 0) {
                    await tx
                        .insert(prerequisite)
                        .values(
                            prerequisiteCourseIds.map((prereqId) => ({
                                id: crypto.randomUUID(),
                                courseId,
                                prerequisiteCourseId: prereqId,
                            }))
                        )
                        .onConflictDoNothing();
                }

                await logAuditEvent({
                    userId: user.id,
                    action: "CREATE",
                    entityType: "COURSE_OFFERING",
                    entityId: offering.id,
                    after: {
                        offering,
                        batchIds,
                        prerequisiteCourseIds,
                    },
                });

                return offering;
            });
        }),

    list: instructorProcedure
        .input(listInstructorOfferingsInputSchema)
        .query(async ({ input, ctx }) => {
            const instructorId = ctx.session.user.id;
            const { page, pageSize, status } = input;
            const offset = (page - 1) * pageSize;

            const conditions = [eq(courseOffering.instructorId, instructorId)];
            if (status) conditions.push(eq(courseOffering.status, status));

            const where = and(...conditions);

            const [items, total] = await Promise.all([
                db.query.courseOffering.findMany({
                    where,
                    with: {
                        course: true,
                        semester: true,
                    },
                    orderBy: [desc(courseOffering.createdAt)],
                    limit: pageSize,
                    offset,
                }),
                db
                    .select({ count: sql<number>`count(*)` })
                    .from(courseOffering)
                    .where(where)
                    .then((r) => r[0]?.count ?? 0),
            ]);

            return {
                items,
                meta: {
                    page: page,
                    pageSize: pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize),
                    hasNextPage: page * pageSize < total,
                },
            };
        }),
});
