import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import { listOfferingsInputSchema } from "../schema";
import {
    course,
    courseOffering,
    courseOfferingInstructor,
    db,
    department,
    semester,
} from "@workspace/db";
import { and, desc, eq, sql, or, lt } from "drizzle-orm";

export const offeringManagement = createTRPCRouter({
    list: adminProcedure
        .input(listOfferingsInputSchema)
        .query(async ({ input }) => {
            const {
                pageSize,
                cursor,
                courseCode,
                semesterYear,
                semesterTerm,
                instructorIds,
                departmentCode,
                courseId,
            } = input;

            const conditions = [];

            if (courseCode) {
                conditions.push(eq(course.code, courseCode));
            }

            if (courseId) {
                conditions.push(eq(course.id, courseId));
            }

            if (semesterYear) {
                conditions.push(eq(semester.year, semesterYear));
            }

            if (semesterTerm) {
                conditions.push(eq(semester.semester, semesterTerm));
            }

            if (departmentCode) {
                conditions.push(eq(department.code, departmentCode));
            }

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
});
