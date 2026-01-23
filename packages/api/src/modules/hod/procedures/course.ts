import { createTRPCRouter } from "@workspace/api/init";
import { hodProcedure } from "../middleware";
import {
    acceptCourseInputSchema,
    getCourseByIdSchema,
    listCourseInputSchema,
    rejectCourseInputSchema,
} from "../schema";
import { course, db, department, logAuditEvent } from "@workspace/db";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const courseManagement = createTRPCRouter({
    acceptCourse: hodProcedure
        .input(acceptCourseInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { courseId } = input;
            const { user } = ctx.session;
            const { departmentId } = ctx.hod;

            const beforeCourse = await db.query.course.findFirst({
                where: and(
                    eq(course.id, courseId),
                    eq(course.departmentId, departmentId)
                ),
            });

            if (!beforeCourse) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Course course not found",
                });
            }

            if (beforeCourse.status !== "PROPOSED") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Only proposed offerings can be accepted",
                });
            }

            const [updated] = await db
                .update(course)
                .set({ status: "HOD_ACCEPTED" })
                .where(eq(course.id, courseId))
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
                entityType: "COURSE",
                entityId: courseId,
                before: beforeCourse,
                after: updated,
            });

            return updated;
        }),

    rejectCourse: hodProcedure
        .input(rejectCourseInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { courseId, reason } = input;
            const { user } = ctx.session;
            const { departmentId } = ctx.hod;

            const beforeCourse = await db.query.course.findFirst({
                where: and(
                    eq(course.id, courseId),
                    eq(course.departmentId, departmentId)
                ),
            });

            if (!beforeCourse) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Course course not found",
                });
            }

            const updated = await db
                .update(course)
                .set({ status: "REJECTED" })
                .where(eq(course.id, courseId))
                .returning();

            await logAuditEvent({
                userId: user.id,
                action: "UPDATE",
                entityType: "COURSE",
                entityId: courseId,
                before: course,
                after: {
                    ...updated,
                    rejectionReason: reason,
                },
            });

            return updated[0];
        }),

    list: hodProcedure
        .input(listCourseInputSchema)
        .query(async ({ input, ctx }) => {
            const { pageSize, cursor, search } = input;
            const { departmentId } = ctx.hod;

            const conditions = [];

            conditions.push(eq(course.departmentId, departmentId));
            conditions.push(eq(course.status, "PROPOSED"));

            if (search) {
                conditions.push(
                    or(
                        ilike(course.code, `%${search}%`),
                        ilike(course.title, `%${search}%`)
                    )
                );
            }

            if (cursor) {
                conditions.push(
                    or(
                        lt(course.createdAt, cursor.createdAt),
                        and(
                            eq(course.createdAt, cursor.createdAt),
                            lt(course.id, cursor.id)
                        )
                    )
                );
            }

            const where = conditions.length ? and(...conditions) : undefined;

            const rows = await db
                .select({
                    course,
                    department,
                })
                .from(course)
                .innerJoin(department, eq(course.departmentId, department.id))
                .where(where)
                .orderBy(desc(course.createdAt), desc(course.id))
                .limit(pageSize + 1);

            const hasNextPage = rows.length > pageSize;
            const courses = hasNextPage ? rows.slice(0, pageSize) : rows;

            const nextCursor = hasNextPage
                ? {
                      createdAt: courses[courses.length - 1]!.course.createdAt,
                      id: courses[courses.length - 1]!.course.id,
                  }
                : null;

            return {
                courses,
                nextCursor,
                hasNextPage,
            };
        }),

    getOne: hodProcedure
        .input(getCourseByIdSchema)
        .query(async ({ input, ctx }) => {
            const { departmentId } = ctx.hod;
            const { id } = input;

            const [result] = await db
                .select({
                    course,
                    department,
                })
                .from(course)
                .innerJoin(department, eq(course.departmentId, department.id))
                .where(
                    and(
                        eq(course.id, id),
                        eq(course.departmentId, departmentId)
                    )
                )
                .limit(1);

            if (!result) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Course not found",
                });
            }

            return result;
        }),
});
