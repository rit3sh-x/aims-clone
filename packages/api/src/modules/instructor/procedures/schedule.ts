import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import {
    classroom,
    course,
    courseOffering,
    courseOfferingInstructor,
    db,
    schedule,
    semester,
    timeSlot,
} from "@workspace/db";
import { and, eq, sql } from "drizzle-orm";

export const scheduleViewer = createTRPCRouter({
    current: instructorProcedure.query(async ({ ctx }) => {
        const instructorId = ctx.instructor.id;

        const currentSemester = await db
            .select()
            .from(semester)
            .where(eq(semester.status, "ONGOING"))
            .limit(1)
            .then((r) => r[0]);

        if (!currentSemester) {
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
            .from(schedule)
            .innerJoin(
                courseOffering,
                eq(schedule.offeringId, courseOffering.id)
            )
            .innerJoin(
                courseOfferingInstructor,
                eq(courseOfferingInstructor.offeringId, courseOffering.id)
            )
            .innerJoin(course, eq(courseOffering.courseId, course.id))
            .innerJoin(timeSlot, eq(schedule.timeSlotId, timeSlot.id))
            .innerJoin(classroom, eq(schedule.classroomId, classroom.id))
            .where(
                and(
                    eq(courseOfferingInstructor.instructorId, instructorId),
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
