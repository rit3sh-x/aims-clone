import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import { TRPCError } from "@trpc/server";
import { course, db, department, logAuditEvent } from "@workspace/db";
import { and, eq, desc, or, type SQL, ilike } from "drizzle-orm";
import {
    proposeCourseInputSchema,
    listInstructorCoursesInputSchema,
    getCourseInputSchema,
    searchInputSchema,
} from "../schema";

export const courseManagement = createTRPCRouter({
    propose: instructorProcedure
        .input(proposeCourseInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { instructor } = ctx;

            const [created] = await db
                .insert(course)
                .values({
                    ...input,
                    departmentId: instructor.departmentId,
                    status: "PROPOSED",
                })
                .returning();

            if (!created) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to propose course",
                });
            }

            await logAuditEvent({
                userId: ctx.session.user.id,
                action: "CREATE",
                entityType: "COURSE",
                entityId: created.id,
                after: created,
            });

            return created;
        }),

    list: instructorProcedure
        .input(listInstructorCoursesInputSchema)
        .query(async ({ input, ctx }) => {
            const { instructor } = ctx;
            const { search } = input;

            const conditions: SQL[] = [
                eq(course.departmentId, instructor.departmentId),
            ];

            if (search) {
                const searchCondition = or(
                    eq(course.title, search),
                    eq(course.description, search),
                    eq(course.code, search)
                );

                if (searchCondition) {
                    conditions.push(searchCondition);
                }
            }
            return db
                .select()
                .from(course)
                .where(and(...conditions))
                .orderBy(desc(course.createdAt));
        }),

    getById: instructorProcedure
        .input(getCourseInputSchema)
        .query(async ({ input, ctx }) => {
            const { instructor } = ctx;
            const { courseId } = input;

            const result = await db
                .select({
                    course,
                    department,
                })
                .from(course)
                .innerJoin(department, eq(course.departmentId, department.id))
                .where(
                    and(
                        eq(course.id, courseId),
                        eq(course.departmentId, instructor.departmentId)
                    )
                )
                .then((rows) => rows[0]);

            if (!result) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Course not found",
                });
            }

            return result;
        }),

    search: instructorProcedure
        .input(searchInputSchema)
        .query(async ({ input, ctx }) => {
            const { search } = input;
            const { instructor } = ctx;

            const searchPattern = `%${search}%`;

            const courses = await db
                .select({
                    id: course.id,
                    code: course.code,
                    title: course.title,
                    credits: course.credits,
                    status: course.status,
                })
                .from(course)
                .where(
                    and(
                        eq(course.departmentId, instructor.departmentId),
                        eq(course.status, "ADMIN_ACCEPTED"),
                        or(
                            ilike(course.code, searchPattern),
                            ilike(course.title, searchPattern)
                        )
                    )
                )
                .limit(5);

            return courses;
        }),
});
