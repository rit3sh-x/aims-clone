import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import { z } from "zod";
import { batch, db, program } from "@workspace/db";
import { ilike, or, sql } from "drizzle-orm";

export const batchManagement = createTRPCRouter({
    search: instructorProcedure
        .input(
            z.object({
                search: z.string().min(1),
            })
        )
        .query(async ({ input }) => {
            const { search } = input;

            const searchPattern = `%${search}%`;

            const batches = await db
                .select({
                    id: batch.id,
                    year: batch.year,
                    programName: program.name,
                    programCode: program.code,
                    degreeType: program.degreeType,
                })
                .from(batch)
                .innerJoin(program, sql`${batch.programId} = ${program.id}`)
                .where(
                    or(
                        ilike(sql`CAST(${batch.year} AS TEXT)`, searchPattern),
                        ilike(program.name, searchPattern),
                        ilike(program.code, searchPattern)
                    )
                )
                .limit(3);

            return batches;
        }),
});
