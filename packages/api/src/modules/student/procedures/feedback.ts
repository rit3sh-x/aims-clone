import { createTRPCRouter } from "@workspace/api/init";
import { studentProcedure } from "../middleware";
import {
    getStudentFeedbackQuestionsInputSchema,
    submitFeedbackInputSchema,
} from "../schema";
import {
    db,
    feedbackQuestion,
    courseFeedback,
    feedbackResponse,
    enrollment,
    courseOffering,
    semester,
    student,
    course,
} from "@workspace/db";
import { and, asc, eq, notExists, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const feedbackManagement = createTRPCRouter({
    getQuestions: studentProcedure
        .input(getStudentFeedbackQuestionsInputSchema)
        .query(async ({ input, ctx }) => {
            const { enrollmentId } = input;
            const { user } = ctx.session;

            const [enrollmentRecord] = await db
                .select({
                    enrollmentId: enrollment.id,
                    offeringId: enrollment.offeringId,
                })
                .from(enrollment)
                .innerJoin(student, eq(enrollment.studentId, student.id))
                .where(
                    and(
                        eq(enrollment.id, enrollmentId),
                        eq(student.userId, user.id)
                    )
                )
                .limit(1);

            if (!enrollmentRecord) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Enrollment not found or does not belong to you",
                });
            }

            const alreadySubmitted = await db
                .select({ id: courseFeedback.id })
                .from(courseFeedback)
                .where(eq(courseFeedback.enrollmentId, enrollmentId))
                .limit(1)
                .then((r) => r.length > 0);

            if (alreadySubmitted) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Feedback already submitted",
                });
            }

            const semesterWindow = await db
                .select({
                    feedbackFormStartDate: semester.feedbackFormStartDate,
                    endDate: semester.endDate,
                })
                .from(enrollment)
                .innerJoin(
                    courseOffering,
                    eq(enrollment.offeringId, courseOffering.id)
                )
                .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
                .where(eq(enrollment.id, enrollmentId))
                .limit(1)
                .then((r) => r[0]);

            const now = new Date();

            if (
                !semesterWindow ||
                now < semesterWindow.feedbackFormStartDate ||
                now > semesterWindow.endDate
            ) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Feedback form is not currently available",
                });
            }

            const questions = await db
                .select()
                .from(feedbackQuestion)
                .orderBy(asc(feedbackQuestion.order));

            return questions;
        }),

    getCourses: studentProcedure.query(async ({ ctx }) => {
        const { user } = ctx.session;

        const courses = await db
            .select({
                enrollmentId: enrollment.id,
                courseId: course.id,
                courseName: course.title,
            })
            .from(enrollment)
            .innerJoin(student, eq(enrollment.studentId, student.id))
            .innerJoin(
                courseOffering,
                eq(enrollment.offeringId, courseOffering.id)
            )
            .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
            .innerJoin(course, eq(courseOffering.courseId, course.id))
            .where(
                and(
                    eq(student.userId, user.id),
                    eq(semester.status, "ONGOING"),
                    notExists(
                        db
                            .select({ one: sql`1` })
                            .from(courseFeedback)
                            .where(
                                eq(courseFeedback.enrollmentId, enrollment.id)
                            )
                    )
                )
            );

        return courses;
    }),

    submit: studentProcedure
        .input(submitFeedbackInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { user } = ctx.session;
            const { enrollmentId, responses } = input;

            const [enrollmentRecord] = await db
                .select({
                    enrollmentId: enrollment.id,
                    studentId: enrollment.studentId,
                })
                .from(enrollment)
                .innerJoin(student, eq(enrollment.studentId, student.id))
                .where(
                    and(
                        eq(enrollment.id, enrollmentId),
                        eq(student.userId, user.id)
                    )
                )
                .limit(1);

            if (!enrollmentRecord) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Enrollment not found or does not belong to you",
                });
            }

            const existingFeedback = await db
                .select({ id: courseFeedback.id })
                .from(courseFeedback)
                .where(eq(courseFeedback.enrollmentId, enrollmentId))
                .limit(1);

            if (existingFeedback.length > 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Feedback already submitted for this course",
                });
            }

            const questions = await db
                .select()
                .from(feedbackQuestion)
                .orderBy(asc(feedbackQuestion.order));

            const requiredQuestions = questions.filter((q) => q.isRequired);
            const answeredQuestionIds = responses.map((r) => r.questionId);

            for (const required of requiredQuestions) {
                if (!answeredQuestionIds.includes(required.id)) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Required question not answered: ${required.questionText}`,
                    });
                }
            }

            const validQuestionIds = questions.map((q) => q.id);
            for (const response of responses) {
                if (!validQuestionIds.includes(response.questionId)) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Invalid question ID: ${response.questionId}`,
                    });
                }
            }

            for (const response of responses) {
                const question = questions.find(
                    (q) => q.id === response.questionId
                );
                if (!question) continue;

                const answersProvided = [
                    response.descriptiveAnswer !== undefined,
                    response.yesNoAnswer !== undefined,
                    response.ratingAnswer !== undefined,
                ].filter(Boolean).length;

                if (answersProvided !== 1) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message:
                            "Exactly one answer type must be provided per response",
                    });
                }

                if (
                    question.questionType === "DESCRIPTIVE" &&
                    response.descriptiveAnswer === undefined
                ) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Question "${question.questionText}" requires a descriptive answer`,
                    });
                }

                if (
                    question.questionType === "YES_NO" &&
                    response.yesNoAnswer === undefined
                ) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Question "${question.questionText}" requires a yes/no answer`,
                    });
                }

                if (
                    question.questionType === "RATING" &&
                    response.ratingAnswer === undefined
                ) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Question "${question.questionText}" requires a rating answer`,
                    });
                }
            }

            await db.transaction(async (tx) => {
                const [feedback] = await tx
                    .insert(courseFeedback)
                    .values({ enrollmentId })
                    .returning();

                if (!feedback) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create feedback record",
                    });
                }

                const responseRecords = responses.map((r) => ({
                    feedbackId: feedback.id,
                    questionId: r.questionId,
                    descriptiveAnswer: r.descriptiveAnswer ?? null,
                    yesNoAnswer: r.yesNoAnswer ?? null,
                    ratingAnswer: r.ratingAnswer ?? null,
                }));

                const createdResponses = await tx
                    .insert(feedbackResponse)
                    .values(responseRecords)
                    .returning();

                return {
                    feedback,
                    responses: createdResponses,
                };
            });
        }),
});
