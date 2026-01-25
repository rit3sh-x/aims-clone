import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    listBatchesInputSchema,
} from "../schema";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { batch, db, program, department } from "@workspace/db";

export const batchManagement = createTRPCRouter({
    list: adminProcedure
        .input(listBatchesInputSchema)
        .query(async ({ input }) => {
            const { programId, year, cursor, pageSize, departmentCode } = input;

            const conditions = [];

            if (programId) {
                conditions.push(eq(batch.programId, programId));
            }

            if (year) {
                conditions.push(eq(batch.year, year));
            }

            if (departmentCode) {
                conditions.push(eq(department.code, departmentCode));
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
                    department,
                })
                .from(batch)
                .innerJoin(program, eq(batch.programId, program.id))
                .innerJoin(department, eq(program.departmentId, department.id))
                .where(conditions.length ? and(...conditions) : undefined)
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
