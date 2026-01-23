import { createTRPCRouter } from "@workspace/api/init";
import { studentProcedure } from "../middleware";
import {
    attendance,
    course,
    courseOffering,
    db,
    enrollment,
    schedule,
    timeSlot,
} from "@workspace/db";
import { and, eq, gte, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { listAttendanceInputSchema } from "../schema";
import { getWeekRange } from "../utils";

export const attendanceViewer = createTRPCRouter({
    list: studentProcedure
        .input(listAttendanceInputSchema)
        .query(async ({ ctx, input }) => {
            const studentUserId = ctx.session.user.id;
            const { page, pageSize, type, weekStart } = input;

            const offset = (page - 1) * pageSize;

            const studentRecord = await db.query.student.findFirst({
                where: (s, { eq }) => eq(s.userId, studentUserId),
            });

            if (!studentRecord) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Student record not found",
                });
            }

            const currentSemester = await db.query.semester.findFirst({
                where: (s, { eq }) => eq(s.status, "ONGOING"),
            });

            if (!currentSemester) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "No ongoing semester",
                });
            }

            const { monday, sunday } = getWeekRange(weekStart ?? new Date());

            const rows = await db
                .select({
                    attendance,
                    course,
                    timeSlot,
                })
                .from(attendance)
                .innerJoin(
                    enrollment,
                    eq(attendance.enrollmentId, enrollment.id)
                )
                .innerJoin(
                    courseOffering,
                    eq(enrollment.offeringId, courseOffering.id)
                )
                .innerJoin(course, eq(courseOffering.courseId, course.id))
                .innerJoin(schedule, eq(schedule.offeringId, courseOffering.id))
                .innerJoin(timeSlot, eq(schedule.timeSlotId, timeSlot.id))
                .where(
                    and(
                        eq(enrollment.studentId, studentRecord.id),
                        eq(courseOffering.semesterId, currentSemester.id),
                        gte(attendance.date, monday),
                        lte(attendance.date, sunday),
                        eq(attendance.type, type)
                    )
                )
                .orderBy(attendance.date, timeSlot.startTime)
                .limit(pageSize + 1)
                .offset(offset);

            const hasNextPage = rows.length > pageSize;

            return {
                week: {
                    from: monday,
                    to: sunday,
                },
                page,
                pageSize,
                hasNextPage,
                data: hasNextPage ? rows.slice(0, pageSize) : rows,
            };
        }),
});
