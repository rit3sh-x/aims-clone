import { createTRPCRouter } from "@workspace/api/init";
import { studentProcedure } from "../middleware";
import {
    courseOffering,
    db,
    enrollment,
    grade,
    semester,
    student,
} from "@workspace/db";
import { and, eq, sql } from "drizzle-orm";

export const selfManagement = createTRPCRouter({
    profile: studentProcedure.query(async ({ ctx }) => {
        return db.query.user.findFirst({
            where: eq(student.id, ctx.session.user.id),
            with: {
                student: {
                    with: {
                        batch: true,
                    },
                },
            },
        });
    }),

    performance: studentProcedure.query(async ({ ctx }) => {
        const studentId = ctx.session.user.id;

        return db
            .select({
                semester,
                sgpa: sql<number>`AVG(${grade.marksObtained})`,
            })
            .from(enrollment)
            .innerJoin(
                courseOffering,
                eq(enrollment.offeringId, courseOffering.id)
            )
            .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
            .innerJoin(grade, eq(grade.enrollmentId, enrollment.id))
            .where(
                and(
                    eq(enrollment.studentId, studentId),
                    eq(enrollment.status, "COMPLETED")
                )
            )
            .groupBy(semester.id);
    }),
});
