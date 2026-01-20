import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    acceptCourseOfferingInputSchema,
    listOfferingsInputSchema,
    rejectCourseOfferingInputSchema,
} from "../schema";
import {
    course,
    courseOffering,
    db,
    department,
    instructor,
    logAuditEvent,
    semester,
} from "@workspace/db";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";

export const offeringManagement = createTRPCRouter({
    acceptCourseOffering: adminProcedure
        .input(acceptCourseOfferingInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { offeringId } = input;
            const { user } = ctx.session;
            const offering = await db.query.courseOffering.findFirst({
                where: eq(courseOffering.id, offeringId),
            });

            if (!offering) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Course offering not found",
                });
            }

            if (offering.status !== "PROPOSED") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Only proposed offerings can be accepted",
                });
            }

            const [updated] = await db
                .update(courseOffering)
                .set({ status: "ENROLLING" })
                .where(eq(courseOffering.id, offeringId))
                .returning();

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to approve the course.",
                });
            }

            await logAuditEvent({
                userId: user.id,
                action: "UPDATE",
                entityType: "COURSE_OFFERING",
                entityId: offeringId,
                after: updated,
            });

            return updated;
        }),

    rejectCourseOffering: adminProcedure
        .input(rejectCourseOfferingInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { offeringId, reason } = input;
            const { user } = ctx.session;
            const offering = await db.query.courseOffering.findFirst({
                where: eq(courseOffering.id, offeringId),
            });

            if (!offering) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Course offering not found",
                });
            }

            const updated = await db
                .update(courseOffering)
                .set({ status: "REJECTED" })
                .where(eq(courseOffering.id, offeringId))
                .returning();

            await logAuditEvent({
                userId: user.id,
                action: "UPDATE",
                entityType: "COURSE_OFFERING",
                entityId: offeringId,
                before: offering,
                after: {
                    ...updated,
                    rejectionReason: reason,
                },
            });

            return updated[0];
        }),

    list: adminProcedure
        .input(listOfferingsInputSchema)
        .query(async ({ input }) => {
            const {
                page,
                pageSize,
                courseCode,
                semesterYear,
                semesterTerm,
                instructorId,
                departmentCode,
                status,
            } = input;

            const limit = pageSize;
            const offset = (page - 1) * pageSize;

            const conditions = [];

            if (courseCode) {
                conditions.push(eq(course.code, courseCode));
            }

            if (semesterYear) {
                conditions.push(eq(semester.year, semesterYear));
            }

            if (semesterTerm) {
                conditions.push(eq(semester.semester, semesterTerm));
            }

            if (instructorId) {
                conditions.push(eq(courseOffering.instructorId, instructorId));
            }

            if (departmentCode) {
                conditions.push(eq(department.code, departmentCode));
            }

            if (status) {
                conditions.push(eq(courseOffering.status, status));
            }

            const where = conditions.length ? and(...conditions) : undefined;

            const [items, total] = await Promise.all([
                db
                    .select({
                        offering: courseOffering,
                        course,
                        department,
                        semester,
                        instructor,
                    })
                    .from(courseOffering)
                    .innerJoin(course, eq(courseOffering.courseId, course.id))
                    .innerJoin(
                        department,
                        eq(course.departmentId, department.id)
                    )
                    .innerJoin(
                        semester,
                        eq(courseOffering.semesterId, semester.id)
                    )
                    .leftJoin(
                        instructor,
                        eq(courseOffering.instructorId, instructor.id)
                    )
                    .where(where)
                    .orderBy(desc(courseOffering.createdAt))
                    .limit(limit)
                    .offset(offset),

                db
                    .select({ count: sql<number>`count(*)` })
                    .from(courseOffering)
                    .innerJoin(course, eq(courseOffering.courseId, course.id))
                    .innerJoin(
                        department,
                        eq(course.departmentId, department.id)
                    )
                    .innerJoin(
                        semester,
                        eq(courseOffering.semesterId, semester.id)
                    )
                    .where(where)
                    .then((r) => r[0]?.count ?? 0),
            ]);

            return {
                items,
                meta: {
                    page,
                    pageSize: limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }),
});
