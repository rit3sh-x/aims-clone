import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import {
    getDescriptiveAnswersInputSchema,
    getInstructorFeedbackResultsInputSchema,
} from "../schema";
import {
    db,
    feedbackQuestion,
    courseFeedback,
    feedbackResponse,
    enrollment,
    courseOfferingInstructor,
    instructor,
} from "@workspace/db";
import { and, asc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const sqlToNum = (val: number | string | null) => Number(val || 0);

export const feedbackManagement = createTRPCRouter({
    getDescriptiveAnswers: instructorProcedure
        .input(getDescriptiveAnswersInputSchema)
        .query(async ({ input, ctx }) => {
            const { offeringId, questionId, pageSize, cursor } = input;
            const { user } = ctx.session;

            const allowed = await db
                .select({ id: courseOfferingInstructor.id })
                .from(courseOfferingInstructor)
                .innerJoin(
                    instructor,
                    eq(courseOfferingInstructor.instructorId, instructor.id)
                )
                .where(
                    and(
                        eq(courseOfferingInstructor.offeringId, offeringId),
                        eq(instructor.userId, user.id)
                    )
                )
                .limit(1)
                .then((rows) => !!rows[0]);

            if (!allowed) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Not authorized",
                });
            }

            const rows = await db
                .select({
                    id: feedbackResponse.id,
                    answer: feedbackResponse.descriptiveAnswer,
                    createdAt: feedbackResponse.createdAt,
                })
                .from(feedbackResponse)
                .innerJoin(
                    courseFeedback,
                    eq(feedbackResponse.feedbackId, courseFeedback.id)
                )
                .innerJoin(
                    enrollment,
                    eq(courseFeedback.enrollmentId, enrollment.id)
                )
                .where(
                    and(
                        eq(enrollment.offeringId, offeringId),
                        eq(feedbackResponse.questionId, questionId),
                        isNotNull(feedbackResponse.descriptiveAnswer),
                        cursor
                            ? sql`${feedbackResponse.id} > ${cursor}`
                            : undefined
                    )
                )
                .orderBy(asc(feedbackResponse.id))
                .limit(pageSize + 1);

            const hasNextPage = rows.length > pageSize;
            const items = hasNextPage ? rows.slice(0, pageSize) : rows;

            return {
                items,
                hasNextPage,
                nextCursor: hasNextPage ? items[items.length - 1]!.id : null,
            };
        }),

    getResults: instructorProcedure
        .input(getInstructorFeedbackResultsInputSchema)
        .query(async ({ input, ctx }) => {
            const { offeringId } = input;
            const { user } = ctx.session;

            const allowed = await db
                .select({ id: courseOfferingInstructor.id })
                .from(courseOfferingInstructor)
                .innerJoin(
                    instructor,
                    eq(courseOfferingInstructor.instructorId, instructor.id)
                )
                .where(
                    and(
                        eq(courseOfferingInstructor.offeringId, offeringId),
                        eq(instructor.userId, user.id)
                    )
                )
                .limit(1);

            if (!allowed.length) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You are not an instructor for this course offering",
                });
            }

            const [questions, totalFeedbackCountResult] = await Promise.all([
                db
                    .select()
                    .from(feedbackQuestion)
                    .orderBy(asc(feedbackQuestion.order)),
                db
                    .select({ count: sql<number>`count(*)` })
                    .from(courseFeedback)
                    .innerJoin(
                        enrollment,
                        eq(courseFeedback.enrollmentId, enrollment.id)
                    )
                    .where(eq(enrollment.offeringId, offeringId))
                    .then((res) => res[0]?.count || 0),
            ]);

            if (totalFeedbackCountResult === 0) {
                return {
                    totalResponses: 0,
                    questions: questions.map((q) => ({
                        question: q,
                        results: null,
                    })),
                };
            }

            const statsRows = await db
                .select({
                    questionId: feedbackResponse.questionId,
                    totalResponses: sql<number>`count(*)`,
                    avgRating: sql<number>`avg(${feedbackResponse.ratingAnswer})`,
                    count1: sql<number>`sum(case when ${feedbackResponse.ratingAnswer} = 1 then 1 else 0 end)`,
                    count2: sql<number>`sum(case when ${feedbackResponse.ratingAnswer} = 2 then 1 else 0 end)`,
                    count3: sql<number>`sum(case when ${feedbackResponse.ratingAnswer} = 3 then 1 else 0 end)`,
                    count4: sql<number>`sum(case when ${feedbackResponse.ratingAnswer} = 4 then 1 else 0 end)`,
                    count5: sql<number>`sum(case when ${feedbackResponse.ratingAnswer} = 5 then 1 else 0 end)`,
                    countYes: sql<number>`sum(case when ${feedbackResponse.yesNoAnswer} = true then 1 else 0 end)`,
                    countNo: sql<number>`sum(case when ${feedbackResponse.yesNoAnswer} = false then 1 else 0 end)`,
                })
                .from(feedbackResponse)
                .innerJoin(
                    courseFeedback,
                    eq(feedbackResponse.feedbackId, courseFeedback.id)
                )
                .innerJoin(
                    enrollment,
                    eq(courseFeedback.enrollmentId, enrollment.id)
                )
                .where(eq(enrollment.offeringId, offeringId))
                .groupBy(feedbackResponse.questionId);

            const statsMap = new Map(statsRows.map((s) => [s.questionId, s]));

            const descriptiveQuestionIds = questions
                .filter((q) => q.questionType === "DESCRIPTIVE")
                .map((q) => q.id);

            let descriptiveMap = new Map<string, string[]>();

            if (descriptiveQuestionIds.length > 0) {
                const textRows = await db
                    .select({
                        questionId: feedbackResponse.questionId,
                        answer: feedbackResponse.descriptiveAnswer,
                    })
                    .from(feedbackResponse)
                    .innerJoin(
                        courseFeedback,
                        eq(feedbackResponse.feedbackId, courseFeedback.id)
                    )
                    .innerJoin(
                        enrollment,
                        eq(courseFeedback.enrollmentId, enrollment.id)
                    )
                    .where(
                        and(
                            eq(enrollment.offeringId, offeringId),
                            inArray(
                                feedbackResponse.questionId,
                                descriptiveQuestionIds
                            ),
                            isNotNull(feedbackResponse.descriptiveAnswer)
                        )
                    );

                for (const row of textRows) {
                    if (row.answer) {
                        const existing =
                            descriptiveMap.get(row.questionId) || [];
                        existing.push(row.answer);
                        descriptiveMap.set(row.questionId, existing);
                    }
                }
            }

            const results = questions.map((question) => {
                const stats = statsMap.get(question.id);

                if (!stats && question.questionType !== "DESCRIPTIVE") {
                    return { question, results: null };
                }

                if (question.questionType === "RATING" && stats) {
                    const total = sqlToNum(stats.totalResponses);
                    const avg = total > 0 ? sqlToNum(stats.avgRating) : 0;

                    return {
                        question,
                        results: {
                            type: "RATING" as const,
                            totalResponses: total,
                            average: Math.round(avg * 100) / 100,
                            distribution: {
                                1: {
                                    count: sqlToNum(stats.count1),
                                    percentage:
                                        total > 0
                                            ? Math.round(
                                                  (sqlToNum(stats.count1) /
                                                      total) *
                                                      100
                                              )
                                            : 0,
                                },
                                2: {
                                    count: sqlToNum(stats.count2),
                                    percentage:
                                        total > 0
                                            ? Math.round(
                                                  (sqlToNum(stats.count2) /
                                                      total) *
                                                      100
                                              )
                                            : 0,
                                },
                                3: {
                                    count: sqlToNum(stats.count3),
                                    percentage:
                                        total > 0
                                            ? Math.round(
                                                  (sqlToNum(stats.count3) /
                                                      total) *
                                                      100
                                              )
                                            : 0,
                                },
                                4: {
                                    count: sqlToNum(stats.count4),
                                    percentage:
                                        total > 0
                                            ? Math.round(
                                                  (sqlToNum(stats.count4) /
                                                      total) *
                                                      100
                                              )
                                            : 0,
                                },
                                5: {
                                    count: sqlToNum(stats.count5),
                                    percentage:
                                        total > 0
                                            ? Math.round(
                                                  (sqlToNum(stats.count5) /
                                                      total) *
                                                      100
                                              )
                                            : 0,
                                },
                            },
                        },
                    };
                } else if (question.questionType === "YES_NO" && stats) {
                    const total = sqlToNum(stats.totalResponses);
                    const yesCount = sqlToNum(stats.countYes);
                    const noCount = sqlToNum(stats.countNo);

                    return {
                        question,
                        results: {
                            type: "YES_NO" as const,
                            totalResponses: total,
                            yes: {
                                count: yesCount,
                                percentage:
                                    total > 0
                                        ? Math.round((yesCount / total) * 100)
                                        : 0,
                            },
                            no: {
                                count: noCount,
                                percentage:
                                    total > 0
                                        ? Math.round((noCount / total) * 100)
                                        : 0,
                            },
                        },
                    };
                } else if (question.questionType === "DESCRIPTIVE") {
                    const answers = descriptiveMap.get(question.id) || [];
                    return {
                        question,
                        results: {
                            type: "DESCRIPTIVE" as const,
                            totalResponses: answers.length,
                            responses: answers,
                        },
                    };
                }

                return { question, results: null };
            });

            return {
                totalResponses: totalFeedbackCountResult,
                questions: results,
            };
        }),
});
