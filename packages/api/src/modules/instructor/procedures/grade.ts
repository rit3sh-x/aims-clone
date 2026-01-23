import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import {
    courseOfferingInstructor,
    enrollment,
    grade,
    student,
    db,
} from "@workspace/db";
import { TRPCError } from "@trpc/server";
import { and, eq, inArray } from "drizzle-orm";
import { bulkAssignGradesInputSchema, listGradesInputSchema } from "../schema";
import { calculateTotalMarksStrict } from "../utils";

export const gradeManagement = createTRPCRouter({
    assignBulk: instructorProcedure
        .input(bulkAssignGradesInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { instructor } = ctx;
            const { offeringId, grades } = input;

            const access = await db
                .select({ id: courseOfferingInstructor.id })
                .from(courseOfferingInstructor)
                .where(
                    and(
                        eq(courseOfferingInstructor.offeringId, offeringId),
                        eq(courseOfferingInstructor.instructorId, instructor.id)
                    )
                )
                .then((r) => r[0]);

            if (!access) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Not authorized to grade this offering",
                });
            }

            const rollNos = grades.map((g) => g.rollNo);

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
                        inArray(student.rollNo, rollNos)
                    )
                );

            if (enrollments.length !== grades.length) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "One or more student roll numbers are invalid",
                });
            }

            const enrollmentMap = new Map(
                enrollments.map((e) => [e.rollNo, e.enrollmentId])
            );

            return db.transaction(async (tx) => {
                const inserts = [];

                for (const g of grades) {
                    const enrollmentId = enrollmentMap.get(g.rollNo)!;

                    const exists = await tx
                        .select({ id: grade.id })
                        .from(grade)
                        .where(eq(grade.enrollmentId, enrollmentId))
                        .then((r) => r[0]);

                    if (exists) {
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                            message: `Grade already assigned for ${g.rollNo}`,
                        });
                    }

                    const totalMarks = await calculateTotalMarksStrict(
                        tx,
                        enrollmentId
                    );

                    inserts.push({
                        enrollmentId,
                        totalMarks,
                        grade: g.grade,
                    });
                }

                await tx.insert(grade).values(inserts);

                return {
                    success: true,
                    count: inserts.length,
                };
            });
        }),

    list: instructorProcedure
        .input(listGradesInputSchema)
        .query(async ({ input, ctx }) => {
            const { instructor } = ctx;
            const { offeringId } = input;

            const access = await db
                .select({ id: courseOfferingInstructor.id })
                .from(courseOfferingInstructor)
                .where(
                    and(
                        eq(courseOfferingInstructor.offeringId, offeringId),
                        eq(courseOfferingInstructor.instructorId, instructor.id)
                    )
                )
                .then((r) => r[0]);

            if (!access) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Not authorized to view grades for this offering",
                });
            }

            return db
                .select({
                    rollNo: student.rollNo,
                    totalMarks: grade.totalMarks,
                    grade: grade.grade,
                })
                .from(grade)
                .innerJoin(enrollment, eq(grade.enrollmentId, enrollment.id))
                .innerJoin(student, eq(enrollment.studentId, student.id))
                .where(eq(enrollment.offeringId, offeringId));
        }),
});
