import { createTRPCRouter } from "@workspace/api/init";
import { studentProcedure } from "../middleware";
import {
    classroom,
    course,
    courseOffering,
    db,
    enrollment,
    schedule,
    semester,
    timeSlot,
} from "@workspace/db";
import { and, eq, sql } from "drizzle-orm";

export const scheduleViewer = createTRPCRouter({
    current: studentProcedure.query(async ({ ctx }) => {
        const studentUserId = ctx.session.user.id;

        const currentSemester = await db
            .select()
            .from(semester)
            .where(eq(semester.status, "ONGOING"))
            .limit(1)
            .then((r) => r[0]);

        if (!currentSemester) {
            return [];
        }

        const studentRecord = await db
            .select()
            .from(enrollment)
            .where(eq(enrollment.studentId, studentUserId))
            .limit(1)
            .then((r) => r[0]);

        if (!studentRecord) {
            return [];
        }

        return db
            .select({
                schedule,
                courseOffering,
                course,
                semester,
                timeSlot,
                classroom,
            })
            .from(enrollment)
            .innerJoin(
                courseOffering,
                eq(enrollment.offeringId, courseOffering.id)
            )
            .innerJoin(schedule, eq(schedule.offeringId, courseOffering.id))
            .innerJoin(course, eq(courseOffering.courseId, course.id))
            .innerJoin(timeSlot, eq(schedule.timeSlotId, timeSlot.id))
            .innerJoin(classroom, eq(schedule.classroomId, classroom.id))
            .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
            .where(
                and(
                    eq(enrollment.studentId, studentUserId),
                    eq(enrollment.status, "ENROLLED"),
                    eq(courseOffering.semesterId, currentSemester.id)
                )
            )
            .orderBy(
                timeSlot.dayOfWeek,
                sql`CASE 
                    WHEN ${timeSlot.theoryPeriod} IS NOT NULL THEN ${timeSlot.theoryPeriod}::text
                    WHEN ${timeSlot.tutorialPeriod} IS NOT NULL THEN ${timeSlot.tutorialPeriod}::text
                    WHEN ${timeSlot.labPeriod} IS NOT NULL THEN ${timeSlot.labPeriod}::text
                END`
            );
    }),
});
