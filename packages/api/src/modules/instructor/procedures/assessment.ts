import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import {
    assessment,
    assessmentTemplate,
    courseOfferingInstructor,
    enrollment,
    grade,
    db,
} from "@workspace/db";
import { TRPCError } from "@trpc/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import {
    uploadAssessmentMarksInputSchema,
    listAssessmentMarksInputSchema,
    listFinalGradesInputSchema,
} from "../schema";

export const assessmentManagement = createTRPCRouter({
    uploadMarks: instructorProcedure
        .input(uploadAssessmentMarksInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { instructor } = ctx;
            const { offeringId, assessmentType, marks } = input;

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
                    message: "Not authorized to upload marks for this offering",
                });
            }

            const template = await db
                .select({
                    id: assessmentTemplate.id,
                    maxMarks: assessmentTemplate.maxMarks,
                })
                .from(assessmentTemplate)
                .where(
                    and(
                        eq(assessmentTemplate.offeringId, offeringId),
                        eq(assessmentTemplate.type, assessmentType)
                    )
                )
                .then((r) => r[0]);

            if (!template) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Assessment template not found for this type",
                });
            }

            for (const m of marks) {
                if (m.marksObtained > template.maxMarks) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Marks exceed maximum (${template.maxMarks})`,
                    });
                }
            }

            const enrollmentIds = marks.map((m) => m.enrollmentId);

            const validEnrollments = await db
                .select({ id: enrollment.id })
                .from(enrollment)
                .where(
                    and(
                        eq(enrollment.offeringId, offeringId),
                        inArray(enrollment.id, enrollmentIds)
                    )
                );

            if (validEnrollments.length !== enrollmentIds.length) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "One or more enrollments are invalid for this offering",
                });
            }

            await db
                .insert(assessment)
                .values(
                    marks.map((m) => ({
                        enrollmentId: m.enrollmentId,
                        templateId: template.id,
                        marksObtained: m.marksObtained,
                    }))
                )
                .onConflictDoUpdate({
                    target: [assessment.enrollmentId, assessment.templateId],
                    set: {
                        marksObtained: sql`excluded.marks_obtained`,
                        updatedAt: new Date(),
                    },
                });

            return { success: true };
        }),

    listMarks: instructorProcedure
        .input(listAssessmentMarksInputSchema)
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
                    message: "Not authorized to view marks for this offering",
                });
            }

            return db
                .select({
                    enrollmentId: assessment.enrollmentId,
                    assessmentType: assessmentTemplate.type,
                    marksObtained: assessment.marksObtained,
                })
                .from(assessment)
                .innerJoin(
                    assessmentTemplate,
                    eq(assessment.templateId, assessmentTemplate.id)
                )
                .where(eq(assessmentTemplate.offeringId, offeringId));
        }),
});
