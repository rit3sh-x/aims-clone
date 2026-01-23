import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    createBatchInputSchema,
    deleteBatchSchema,
    listBatchesInputSchema,
    updateBatchInputSchema,
} from "../schema";
import { and, desc, eq, lt, ne, or } from "drizzle-orm";
import { batch, db, logAuditEvent, program } from "@workspace/db";
import { TRPCError } from "@trpc/server";

export const batchManagement = createTRPCRouter({
    list: adminProcedure
        .input(listBatchesInputSchema)
        .query(async ({ input }) => {
            const { programId, year, cursor, pageSize } = input;

            const conditions = [];

            if (programId) {
                conditions.push(eq(batch.programId, programId));
            }

            if (year) {
                conditions.push(eq(batch.year, year));
            }

            if (cursor) {
                conditions.push(
                    or(
                        lt(batch.year, cursor.year),
                        and(
                            eq(batch.year, cursor.year),
                            lt(batch.id, cursor.id)
                        )
                    )
                );
            }

            const items = await db.query.batch.findMany({
                where: conditions.length ? and(...conditions) : undefined,
                with: {
                    program: { with: { department: true } },
                    advisor: true,
                },
                orderBy: [desc(batch.year), desc(batch.id)],
                limit: pageSize + 1,
            });

            const hasNextPage = items.length > pageSize;
            const results = hasNextPage ? items.slice(0, pageSize) : items;

            const nextCursor = hasNextPage
                ? {
                      year: results[results.length - 1]!.year,
                      id: results[results.length - 1]!.id,
                  }
                : null;

            return {
                items: results,
                nextCursor,
                hasNextPage,
            };
        }),

    create: adminProcedure
        .input(createBatchInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { programId, year, advisorId } = input;
            const { user } = ctx.session;

            const programRecord = await db.query.program.findFirst({
                where: eq(program.id, programId),
            });

            if (!programRecord) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Program not found",
                });
            }

            const existingBatch = await db.query.batch.findFirst({
                where: and(
                    eq(batch.programId, programId),
                    eq(batch.year, year)
                ),
            });

            if (existingBatch) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Batch already exists for this program and year",
                });
            }

            const [created] = await db
                .insert(batch)
                .values({
                    year,
                    programId,
                    advisorId: advisorId,
                })
                .returning();

            if (!created) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create batch",
                });
            }

            await logAuditEvent({
                userId: user.id,
                action: "CREATE",
                entityType: "BATCH",
                entityId: created.id,
                after: created,
            });

            return created;
        }),

    update: adminProcedure
        .input(updateBatchInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { id, year, programId, advisorId } = input;
            const { user } = ctx.session;

            const existingBatch = await db.query.batch.findFirst({
                where: eq(batch.id, id),
            });

            if (!existingBatch) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Batch not found",
                });
            }

            const finalProgramId = programId ?? existingBatch.programId;
            const finalYear = year ?? existingBatch.year;

            if (
                finalProgramId !== existingBatch.programId ||
                finalYear !== existingBatch.year
            ) {
                const conflict = await db.query.batch.findFirst({
                    where: and(
                        eq(batch.programId, finalProgramId),
                        eq(batch.year, finalYear),
                        ne(batch.id, id)
                    ),
                });

                if (conflict) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message:
                            "Batch already exists for this program and year",
                    });
                }
            }

            const [updated] = await db
                .update(batch)
                .set({
                    ...(year !== undefined && { year }),
                    ...(programId !== undefined && { programId }),
                    ...(advisorId !== undefined && { advisorId }),
                })
                .where(eq(batch.id, id))
                .returning();

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update batch",
                });
            }

            await logAuditEvent({
                userId: user.id,
                action: "UPDATE",
                entityType: "BATCH",
                entityId: id,
                before: existingBatch,
                after: updated,
            });

            return updated;
        }),
    delete: adminProcedure
        .input(deleteBatchSchema)
        .mutation(async ({ input, ctx }) => {
            const { id } = input;
            const { user } = ctx.session;

            const existing = await db.query.batch.findFirst({
                where: eq(batch.id, id),
            });

            if (!existing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Batch not found",
                });
            }

            await db.delete(batch).where(eq(batch.id, id));

            await logAuditEvent({
                userId: user.id,
                action: "DELETE",
                entityType: "BATCH",
                entityId: id,
                before: existing,
            });

            return existing;
        }),
});
