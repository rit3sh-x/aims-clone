import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import {
    attendance,
    courseOfferingInstructor,
    db,
    enrollment,
    student,
} from "@workspace/db";
import { and, eq, gt, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { bulkAttendanceInput, attendanceSummaryCursorInput } from "../schema";

export const attendanceManagement = createTRPCRouter({
    uploadDaily: instructorProcedure
        .input(bulkAttendanceInput)
        .mutation(async ({ ctx, input }) => {
            const instructorId = ctx.instructor.id;
            const { offeringId, date, type, records } = input;

            const teaches = await db.query.courseOfferingInstructor.findFirst({
                where: and(
                    eq(courseOfferingInstructor.offeringId, offeringId),
                    eq(courseOfferingInstructor.instructorId, instructorId)
                ),
            });

            if (!teaches) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are not assigned to this course offering",
                });
            }

            const enrollments = await db
                .select({
                    enrollmentId: enrollment.id,
                    rollNo: student.rollNo,
                })
                .from(enrollment)
                .innerJoin(student, eq(enrollment.studentId, student.id))
                .where(
                    and(
                        eq(enrollment.offeringId, offeringId),
                        eq(enrollment.status, "ENROLLED")
                    )
                );

            const enrollmentByRollNo = new Map(
                enrollments.map((e) => [e.rollNo, e.enrollmentId])
            );

            const rows = records.map((r) => {
                const enrollmentId = enrollmentByRollNo.get(r.rollNo);

                if (!enrollmentId) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Roll No ${r.rollNo} is not enrolled in this course`,
                    });
                }

                return {
                    enrollmentId,
                    date,
                    type,
                    status: r.status,
                    remarks: r.remarks,
                };
            });

            await db.insert(attendance).values(rows);

            return {
                success: true,
                inserted: rows.length,
            };
        }),

    summary: instructorProcedure
        .input(attendanceSummaryCursorInput)
        .query(async ({ ctx, input }) => {
            const instructorId = ctx.instructor.id;
            const { offeringId, type, cursor, pageSize } = input;

            const teaches = await db.query.courseOfferingInstructor.findFirst({
                where: and(
                    eq(courseOfferingInstructor.offeringId, offeringId),
                    eq(courseOfferingInstructor.instructorId, instructorId)
                ),
            });

            if (!teaches) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are not assigned to this course offering",
                });
            }

            const rows = await db
                .select({
                    enrollmentId: enrollment.id,
                    rollNo: student.rollNo,
                    totalClasses: sql<number>`COUNT(${attendance.id})`,
                    attendedClasses: sql<number>`
                        COUNT(${attendance.id})
                        FILTER (WHERE ${attendance.status} = 'PRESENT')
                    `,
                })
                .from(enrollment)
                .innerJoin(student, eq(enrollment.studentId, student.id))
                .innerJoin(
                    attendance,
                    eq(attendance.enrollmentId, enrollment.id)
                )
                .where(
                    and(
                        eq(enrollment.offeringId, offeringId),
                        type ? eq(attendance.type, type) : undefined,
                        cursor ? gt(enrollment.id, cursor) : undefined
                    )
                )
                .groupBy(enrollment.id, student.rollNo)
                .orderBy(enrollment.id)
                .limit(pageSize + 1);

            const hasNextPage = rows.length > pageSize;
            const data = hasNextPage ? rows.slice(0, pageSize) : rows;

            return {
                data: data.map((r) => ({
                    enrollmentId: r.enrollmentId,
                    rollNo: r.rollNo,
                    totalClasses: Number(r.totalClasses),
                    attendedClasses: Number(r.attendedClasses),
                    attendancePercentage:
                        r.totalClasses === 0
                            ? 0
                            : Number(
                                  (
                                      (r.attendedClasses / r.totalClasses) *
                                      100
                                  ).toFixed(2)
                              ),
                })),
                nextCursor: hasNextPage
                    ? data[data.length - 1]!.enrollmentId
                    : null,
            };
        }),
});
