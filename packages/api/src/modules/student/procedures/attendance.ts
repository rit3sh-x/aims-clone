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
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { listAttendanceInputSchema } from "../schema";
import { getWeekRange } from "../utils";

export const attendanceViewer = createTRPCRouter({
    list: studentProcedure
        .input(listAttendanceInputSchema)
        .query(async ({ ctx, input }) => {
            const studentUserId = ctx.session.user.id;
            const { page, pageSize, weekStart } = input;

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
                        lte(attendance.date, sunday)
                    )
                )
                .orderBy(
                    attendance.date,
                    timeSlot.dayOfWeek,
                    sql`CASE 
                        WHEN ${timeSlot.theoryPeriod} IS NOT NULL THEN ${timeSlot.theoryPeriod}::text
                        WHEN ${timeSlot.tutorialPeriod} IS NOT NULL THEN ${timeSlot.tutorialPeriod}::text
                        WHEN ${timeSlot.labPeriod} IS NOT NULL THEN ${timeSlot.labPeriod}::text
                    END`
                )
                .limit(pageSize + 1)
                .offset(offset);

            const hasNextPage = rows.length > pageSize;
            const items = hasNextPage ? rows.slice(0, pageSize) : rows;

            return {
                week: {
                    from: monday,
                    to: sunday,
                },
                items,
                nextCursor: hasNextPage ? page + 1 : undefined,
            };
        }),
});
