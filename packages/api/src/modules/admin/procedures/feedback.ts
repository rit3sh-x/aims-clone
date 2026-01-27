import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    createFeedbackQuestionsInputSchema,
    updateFeedbackQuestionInputSchema,
    deleteFeedbackQuestionsInputSchema,
    reorderFeedbackQuestionsInputSchema,
} from "../schema";
import { db, feedbackQuestion, feedbackResponse } from "@workspace/db";
import { asc, eq, inArray, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { MAX_POSSIBLE_QUESTIONS } from "../../constants";

export const feedbackManagement = createTRPCRouter({
    list: adminProcedure.query(async () => {
        const questions = await db
            .select()
            .from(feedbackQuestion)
            .orderBy(asc(feedbackQuestion.order));

        return questions;
    }),

    create: adminProcedure
        .input(createFeedbackQuestionsInputSchema)
        .mutation(async ({ input }) => {
            const { questions } = input;

            const existingCount = await db
                .select({ count: sql<number>`count(*)` })
                .from(feedbackQuestion);

            const currentCount = Number(existingCount[0]?.count ?? 0);
            if (currentCount + questions.length > MAX_POSSIBLE_QUESTIONS) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Cannot create questions. Maximum ${MAX_POSSIBLE_QUESTIONS} questions allowed. Current: ${currentCount}, Attempting to add: ${questions.length}`,
                });
            }

            const orders = questions.map((q) => q.order);
            const uniqueOrders = new Set(orders);
            if (orders.length !== uniqueOrders.size) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Question orders must be unique",
                });
            }

            const existingOrders = await db
                .select({ order: feedbackQuestion.order })
                .from(feedbackQuestion)
                .where(sql`${feedbackQuestion.order} IN ${orders}`);

            if (existingOrders.length > 0) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: `Orders already exist: ${existingOrders.map((o) => o.order).join(", ")}`,
                });
            }

            const created = await db
                .insert(feedbackQuestion)
                .values(questions)
                .returning();

            return created;
        }),

    update: adminProcedure
        .input(updateFeedbackQuestionInputSchema)
        .mutation(async ({ input }) => {
            const { id, questionText, questionType, isRequired, order } = input;

            const [existing] = await db
                .select()
                .from(feedbackQuestion)
                .where(eq(feedbackQuestion.id, id))
                .limit(1);

            if (!existing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Question not found",
                });
            }

            if (order !== undefined && order !== existing.order) {
                const orderConflict = await db
                    .select()
                    .from(feedbackQuestion)
                    .where(eq(feedbackQuestion.order, order))
                    .limit(1);

                if (orderConflict.length > 0) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: `Order ${order} is already taken`,
                    });
                }
            }

            const updateData: Record<string, any> = {};
            if (questionText !== undefined)
                updateData.questionText = questionText;
            if (questionType !== undefined)
                updateData.questionType = questionType;
            if (isRequired !== undefined) updateData.isRequired = isRequired;
            if (order !== undefined) updateData.order = order;

            const updated = await db
                .update(feedbackQuestion)
                .set(updateData)
                .where(eq(feedbackQuestion.id, id))
                .returning();

            return updated[0];
        }),

    delete: adminProcedure
        .input(deleteFeedbackQuestionsInputSchema)
        .mutation(async ({ input }) => {
            const { ids } = input;

            const existing = await db
                .select({ id: feedbackQuestion.id })
                .from(feedbackQuestion)
                .where(inArray(feedbackQuestion.id, ids));

            if (existing.length !== ids.length) {
                const existingIds = existing.map((q) => q.id);
                const missingIds = ids.filter(
                    (id) => !existingIds.includes(id)
                );

                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Questions not found: ${missingIds.join(", ")}`,
                });
            }

            const used = await db
                .select({ questionId: feedbackResponse.questionId })
                .from(feedbackResponse)
                .where(inArray(feedbackResponse.questionId, ids))
                .limit(1);

            if (used.length > 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "One or more questions already have responses and cannot be deleted",
                });
            }

            const deleted = await db
                .delete(feedbackQuestion)
                .where(inArray(feedbackQuestion.id, ids))
                .returning({ id: feedbackQuestion.id });

            return {
                deletedCount: deleted.length,
                deletedIds: deleted.map((q) => q.id),
            };
        }),

    reorder: adminProcedure
        .input(reorderFeedbackQuestionsInputSchema)
        .mutation(async ({ input }) => {
            const { questions } = input;

            const orders = questions.map((q) => q.order);
            const uniqueOrders = new Set(orders);
            if (orders.length !== uniqueOrders.size) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Question orders must be unique",
                });
            }

            const ids = questions.map((q) => q.id);
            const existing = await db
                .select({ id: feedbackQuestion.id })
                .from(feedbackQuestion)
                .where(sql`${feedbackQuestion.id} IN ${ids}`);

            if (existing.length !== ids.length) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "One or more questions not found",
                });
            }

            const updated = await db.transaction(async (tx) => {
                const results = [];
                for (const q of questions) {
                    const result = await tx
                        .update(feedbackQuestion)
                        .set({ order: q.order })
                        .where(eq(feedbackQuestion.id, q.id))
                        .returning();
                    results.push(result[0]);
                }
                return results;
            });

            return updated;
        }),
});
