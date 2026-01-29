import { createTRPCRouter } from "@workspace/api/init";
import { studentProcedure } from "../middleware";
import { TRPCError } from "@trpc/server";
import { course, db, department, student } from "@workspace/db";
import { and, eq, desc, or, ilike, type SQL } from "drizzle-orm";
import {
    listStudentCoursesInputSchema,
    getStudentCourseInputSchema,
} from "../schema";

export const courseManagement = createTRPCRouter({
    list: studentProcedure
        .input(listStudentCoursesInputSchema)
        .query(async ({ input, ctx }) => {
            const studentUserId = ctx.session.user.id;
            const { search, departmentCode } = input;

            const studentRecord = await db.query.student.findFirst({
                where: eq(student.userId, studentUserId),
                with: {
                    batch: {
                        with: {
                            program: true,
                        },
                    },
                },
            });

            if (!studentRecord) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Student record not found",
                });
            }

            const conditions: SQL[] = [eq(course.status, "ADMIN_ACCEPTED")];

            if (departmentCode) {
                const dept = await db.query.department.findFirst({
                    where: eq(department.code, departmentCode.toUpperCase()),
                });
                if (dept) {
                    conditions.push(eq(course.departmentId, dept.id));
                }
            }

            if (search) {
                const searchCondition = or(
                    ilike(course.title, `%${search}%`),
                    ilike(course.code, `%${search}%`)
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

    getById: studentProcedure
        .input(getStudentCourseInputSchema)
        .query(async ({ input, ctx }) => {
            const studentUserId = ctx.session.user.id;
            const { courseId } = input;

            const studentRecord = await db.query.student.findFirst({
                where: eq(student.userId, studentUserId),
            });

            if (!studentRecord) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Student record not found",
                });
            }

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
                        eq(course.status, "ADMIN_ACCEPTED")
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
});
