import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    listProgramsInputSchema,
} from "../schema";
import { and, asc, eq, gt, ilike, or } from "drizzle-orm";
import { db, program } from "@workspace/db";

export const programManagement = createTRPCRouter({
    list: adminProcedure
        .input(listProgramsInputSchema)
        .query(async ({ input }) => {
            const { departmentId, search, cursor, pageSize } = input;

            const conditions = [];

            if (departmentId) {
                conditions.push(eq(program.departmentId, departmentId));
            }

            if (search) {
                conditions.push(
                    or(
                        ilike(program.name, `%${search}%`),
                        ilike(program.code, `%${search}%`)
                    )
                );
            }

            if (cursor) {
                conditions.push(
                    or(
                        gt(program.code, cursor.code),
                        and(
                            eq(program.code, cursor.code),
                            gt(program.id, cursor.id)
                        )
                    )
                );
            }

            const items = await db.query.program.findMany({
                where: conditions.length ? and(...conditions) : undefined,
                with: { department: true },
                orderBy: [asc(program.code), asc(program.id)],
                limit: pageSize + 1,
            });

            const hasNextPage = items.length > pageSize;
            const results = hasNextPage ? items.slice(0, pageSize) : items;

            const nextCursor = hasNextPage
                ? {
                      code: results[results.length - 1]!.code,
                      id: results[results.length - 1]!.id,
                  }
                : null;

            return {
                items: results,
                nextCursor,
                hasNextPage,
            };
        }),
});
