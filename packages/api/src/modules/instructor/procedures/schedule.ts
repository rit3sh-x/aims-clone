import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import { getSemesterScheduleInputSchema } from "../schema";
import {
    classroom,
    course,
    courseOffering,
    db,
    schedule,
    semester,
    timeSlot,
} from "@workspace/db";
import { and, eq } from "drizzle-orm";

export const scheduleViewer = createTRPCRouter({
    list: instructorProcedure
        .input(getSemesterScheduleInputSchema)
        .query(async ({ ctx, input }) => {
            const instructorId = ctx.session.user.id;

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
                .innerJoin(course, eq(courseOffering.courseId, course.id))
                .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
                .innerJoin(timeSlot, eq(schedule.timeSlotId, timeSlot.id))
                .innerJoin(classroom, eq(schedule.classroomId, classroom.id))
                .where(
                    and(
                        eq(courseOffering.instructorId, instructorId),
                        eq(courseOffering.semesterId, input.semesterId)
                    )
                )
                .orderBy(timeSlot.dayOfWeek, timeSlot.startTime);
        }),
});
