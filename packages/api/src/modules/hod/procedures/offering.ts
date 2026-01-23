import { createTRPCRouter } from "@workspace/api/init";
import { hodProcedure } from "../middleware";
import {
    acceptCourseOfferingInputSchema,
    listOfferingsInputSchema,
} from "../schema";
import {
    course,
    courseOffering,
    courseOfferingInstructor,
    db,
    department,
    logAuditEvent,
    semester,
} from "@workspace/db";
import { and, desc, eq, sql, or, lt } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const offeringManagement = createTRPCRouter({
    list: hodProcedure
        .input(listOfferingsInputSchema)
        .query(async ({ input, ctx }) => {
            const { departmentId } = ctx.hod;
            const { pageSize, cursor, courseCode, instructorIds } = input;

            const currentSemester = await db.query.semester.findFirst({
                where: (s, { eq }) => eq(s.status, "ONGOING"),
            });

            if (!currentSemester) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No active semester found.",
                });
            }

            const conditions = [];

            if (courseCode) {
                conditions.push(eq(course.code, courseCode));
            }

            conditions.push(eq(department.id, departmentId));

            if (instructorIds && instructorIds.length > 0) {
                conditions.push(
                    sql`
                        EXISTS (
                            SELECT 1
                            FROM ${courseOfferingInstructor} coi
                            WHERE coi.offering_id = ${courseOffering.id}
                            AND coi.instructor_id IN ${instructorIds}
                        )
                    `
                );
            }

            if (cursor) {
                conditions.push(
                    or(
                        lt(courseOffering.createdAt, cursor.createdAt),
                        and(
                            eq(courseOffering.createdAt, cursor.createdAt),
                            lt(courseOffering.id, cursor.id)
                        )
                    )
                );
            }

            const where = conditions.length ? and(...conditions) : undefined;

            const rows = await db
                .select({
                    offering: courseOffering,
                    course,
                    department,
                    semester,
                })
                .from(courseOffering)
                .innerJoin(course, eq(courseOffering.courseId, course.id))
                .innerJoin(department, eq(course.departmentId, department.id))
                .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
                .where(where)
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

    accept: hodProcedure
        .input(acceptCourseOfferingInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { departmentId } = ctx.hod;
            const { id } = input;
            const { user } = ctx.session;

            const currentSemester = await db.query.semester.findFirst({
                where: (s, { eq }) => eq(s.status, "ONGOING"),
            });

            if (!currentSemester) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No active semester found.",
                });
            }

            const [offering] = await db
                .select({
                    offering: courseOffering,
                })
                .from(courseOffering)
                .innerJoin(course, eq(courseOffering.courseId, course.id))
                .where(
                    and(
                        eq(courseOffering.id, id),
                        eq(course.departmentId, departmentId),
                        eq(courseOffering.semesterId, currentSemester.id),
                        eq(courseOffering.status, "PROPOSED")
                    )
                )
                .limit(1);

            if (!offering) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message:
                        "Course offering not found, not in your department, or not eligible for acceptance.",
                });
            }

            const [updated] = await db
                .update(courseOffering)
                .set({ status: "ENROLLING" })
                .where(eq(courseOffering.id, id))
                .returning();

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to accept course offering.",
                });
            }

            await logAuditEvent({
                userId: user.id,
                action: "UPDATE",
                entityType: "COURSE_OFFERING",
                entityId: id,
                before: offering,
                after: updated,
            });

            return updated;
        }),
});
