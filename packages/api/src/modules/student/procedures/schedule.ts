import { createTRPCRouter } from "@workspace/api/init";
import { calendarViewInputSchema, listScheduleInputSchema } from "../schema";
import { studentProcedure } from "../middleware";
import {
    attendance,
    classroom,
    course,
    courseOffering,
    db,
    enrollment,
    schedule,
    timeSlot,
} from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const scheduleViewer = createTRPCRouter({
    list: studentProcedure
        .input(listScheduleInputSchema)
        .query(async ({ input, ctx }) => {
            const studentId = ctx.session.user.id;

            return db
                .select({
                    schedule,
                    course,
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
                .where(
                    and(
                        eq(enrollment.studentId, studentId),
                        eq(courseOffering.semesterId, input.semesterId),
                        eq(enrollment.status, "ENROLLED")
                    )
                )
                .orderBy(timeSlot.dayOfWeek, timeSlot.startTime);
        }),

    calendar: studentProcedure
        .input(calendarViewInputSchema)
        .query(async ({ input, ctx }) => {
            const studentId = ctx.session.user.id;
            const { semesterId, courseId } = input;

            const offering = await db
                .select({
                    id: courseOffering.id,
                })
                .from(courseOffering)
                .where(
                    and(
                        eq(courseOffering.courseId, courseId),
                        eq(courseOffering.semesterId, semesterId)
                    )
                )
                .then((r) => r[0]);

            if (!offering) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Course is not offered in this semester",
                });
            }

            const enrollmentRecord = await db
                .select({
                    id: enrollment.id,
                })
                .from(enrollment)
                .where(
                    and(
                        eq(enrollment.studentId, studentId),
                        eq(enrollment.offeringId, offering.id)
                    )
                )
                .then((r) => r[0]);

            if (!enrollmentRecord) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are not enrolled in this course",
                });
            }

            const [scheduleRows, attendanceRows] = await Promise.all([
                db
                    .select({
                        dayOfWeek: timeSlot.dayOfWeek,
                        startTime: timeSlot.startTime,
                        endTime: timeSlot.endTime,
                        classroom: classroom.room,
                        building: classroom.building,
                    })
                    .from(schedule)
                    .innerJoin(timeSlot, eq(schedule.timeSlotId, timeSlot.id))
                    .innerJoin(
                        classroom,
                        eq(schedule.classroomId, classroom.id)
                    )
                    .where(eq(schedule.offeringId, offering.id))
                    .orderBy(timeSlot.dayOfWeek, timeSlot.startTime),

                db
                    .select({
                        date: attendance.date,
                        status: attendance.status,
                        type: attendance.type,
                        remarks: attendance.remarks,
                    })
                    .from(attendance)
                    .where(eq(attendance.enrollmentId, enrollmentRecord.id))
                    .orderBy(attendance.date),
            ]);

            return {
                courseId,
                semesterId,
                offeringId: offering.id,
                schedule: scheduleRows,
                attendance: attendanceRows,
            };
        }),
});
