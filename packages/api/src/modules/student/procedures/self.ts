import { createTRPCRouter } from "@workspace/api/init";
import { studentProcedure } from "../middleware";
import {
    course,
    courseOffering,
    db,
    enrollment,
    grade,
    semester,
} from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { GradeType } from "@workspace/db";

const GRADE_POINTS: Record<GradeType, number | null> = {
    A: 10,
    "A-": 9,
    B: 8,
    "B-": 7,
    C: 6,
    "C-": 5,
    D: 4,
    E: null,
    F: null,
};

export const selfManagement = createTRPCRouter({
    performance: studentProcedure.query(async ({ ctx }) => {
        const studentId = ctx.session.user.id;

        const rows = await db
            .select({
                semester,
                course,
                grade: grade.grade,
            })
            .from(enrollment)
            .innerJoin(grade, eq(grade.enrollmentId, enrollment.id))
            .innerJoin(
                courseOffering,
                eq(enrollment.offeringId, courseOffering.id)
            )
            .innerJoin(course, eq(courseOffering.courseId, course.id))
            .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
            .where(
                and(
                    eq(enrollment.studentId, studentId),
                    eq(enrollment.status, "COMPLETED")
                )
            )
            .orderBy(semester.startDate);

        const bySemester = new Map<
            string,
            {
                semester: typeof semester.$inferSelect;
                courses: Array<{
                    course: typeof course.$inferSelect;
                    grade: GradeType;
                }>;
                totalCredits: number;
                totalPoints: number;
            }
        >();

        for (const row of rows) {
            const gp = GRADE_POINTS[row.grade];
            const semId = row.semester.id;

            if (!bySemester.has(semId)) {
                bySemester.set(semId, {
                    semester: row.semester,
                    courses: [],
                    totalCredits: 0,
                    totalPoints: 0,
                });
            }

            const sem = bySemester.get(semId)!;
            sem.courses.push({
                course: row.course,
                grade: row.grade,
            });

            if (gp !== null) {
                sem.totalCredits += row.course.credits;
                sem.totalPoints += row.course.credits * gp;
            }
        }

        let cumulativeCredits = 0;
        let cumulativePoints = 0;

        const result = [];

        for (const sem of bySemester.values()) {
            const sgpa =
                sem.totalCredits === 0
                    ? 0
                    : Number((sem.totalPoints / sem.totalCredits).toFixed(2));

            cumulativeCredits += sem.totalCredits;
            cumulativePoints += sem.totalPoints;

            const cgpa =
                cumulativeCredits === 0
                    ? 0
                    : Number((cumulativePoints / cumulativeCredits).toFixed(2));

            result.push({
                semester: sem.semester,
                courses: sem.courses,
                sgpa,
                cgpa,
            });
        }

        return result;
    }),
});
