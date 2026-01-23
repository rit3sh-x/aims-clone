import { createTRPCRouter } from "@workspace/api/init";
import { hodProcedure } from "../middleware";
import { listBatchesInputSchema } from "../schema";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { batch, db, program } from "@workspace/db";

export const batchManagement = createTRPCRouter({
    list: hodProcedure
        .input(listBatchesInputSchema)
        .query(async ({ input, ctx }) => {
            const { departmentId } = ctx.hod;
            const { programId, year, cursor, pageSize } = input;

            const conditions = [];

            conditions.push(eq(program.departmentId, departmentId));

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

            const items = await db
                .select({
                    batch,
                    program,
                })
                .from(batch)
                .innerJoin(program, eq(batch.programId, program.id))
                .where(and(...conditions))
                .orderBy(desc(batch.year), desc(batch.id))
                .limit(pageSize + 1);

            const hasNextPage = items.length > pageSize;
            const results = hasNextPage ? items.slice(0, pageSize) : items;

            const nextCursor = hasNextPage
                ? {
                      year: results[results.length - 1]!.batch.year,
                      id: results[results.length - 1]!.batch.id,
                  }
                : null;

            return {
                items: results,
                nextCursor,
                hasNextPage,
            };
        }),
});
