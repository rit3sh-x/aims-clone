import { assessment, assessmentTemplate, enrollment, db } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

type Database = typeof db;

export async function calculateTotalMarksStrict(
    db: Database,
    enrollmentId: string
): Promise<number> {
    const rows = await db
        .select({
            obtained: assessment.marksObtained,
            max: assessmentTemplate.maxMarks,
            weight: assessmentTemplate.weightage,
            templateId: assessmentTemplate.id,
        })
        .from(assessment)
        .innerJoin(
            assessmentTemplate,
            eq(assessment.templateId, assessmentTemplate.id)
        )
        .where(eq(assessment.enrollmentId, enrollmentId));

    if (rows.length === 0) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No marks entered for this enrollment",
        });
    }

    const [vals] = await db
        .select({
            count: sql<number>`count(*)`,
            totalWeight: sql<number>`sum(${assessmentTemplate.weightage})`,
        })
        .from(assessmentTemplate)
        .innerJoin(
            enrollment,
            eq(assessmentTemplate.offeringId, enrollment.offeringId)
        )
        .where(eq(enrollment.id, enrollmentId));

    if (!vals) {
        throw new TRPCError({
            code: "CONFLICT",
            message: "Failed to claculate the total marks",
        });
    }

    const { count, totalWeight } = vals;

    if (rows.length !== Number(count)) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message:
                "Cannot assign grade: one or more assessments are missing marks",
        });
    }

    const EPSILON = 0.0001;

    if (Math.abs(Number(totalWeight) - 100) > EPSILON) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Assessment weightage does not sum to 100%",
        });
    }

    let total = 0;

    for (const m of rows) {
        if (m.max <= 0) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Invalid assessment configuration detected",
            });
        }

        total += (m.obtained / m.max) * m.weight;
    }

    return Math.round(total * 100) / 100;
}
