import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
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
    acceptCourse: adminProcedure
        .input(acceptCourseInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { courseId } = input;
            const { user } = ctx.session;
            const beforeCourse = await db.query.course.findFirst({
                where: eq(course.id, courseId),
            });

            if (!beforeCourse) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Course course not found",
                });
            }

            if (beforeCourse.status !== "HOD_ACCEPTED") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Only proposed offerings can be accepted",
                });
            }

            const [updated] = await db
                .update(course)
                .set({ status: "ADMIN_ACCEPTED" })
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

    rejectCourse: adminProcedure
        .input(rejectCourseInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { courseId, reason } = input;
            const { user } = ctx.session;
            const beforeCourse = await db.query.course.findFirst({
                where: eq(course.id, courseId),
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

    list: adminProcedure
        .input(listCourseInputSchema)
        .query(async ({ input }) => {
            const { pageSize, cursor, departmentCode, search } = input;

            const conditions = [];

            if (search) {
                conditions.push(
                    or(
                        ilike(course.code, `%${search}%`),
                        ilike(course.title, `%${search}%`)
                    )
                );
            }

            if (departmentCode) {
                conditions.push(eq(department.code, departmentCode));
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

    getOne: adminProcedure
        .input(getCourseByIdSchema)
        .query(async ({ input }) => {
            const { id } = input;

            const result = await db
                .select({
                    course,
                    department,
                })
                .from(course)
                .innerJoin(department, eq(course.departmentId, department.id))
                .where(eq(course.id, id))
                .limit(1)
                .then((r) => r[0]);

            if (!result) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Course not found",
                });
            }

            return result;
        }),
});
