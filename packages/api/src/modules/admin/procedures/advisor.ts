import { createTRPCRouter } from "@workspace/api/init";
import {
    getAdvisorByIdInputSchema,
    listAdvisorsInputSchema,
} from "../schema";
import { adminProcedure } from "../middleware";
import {
    db,
    advisor,
    department,
    user,
} from "@workspace/db";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const advisorManagement = createTRPCRouter({
    list: adminProcedure
        .input(listAdvisorsInputSchema)
        .query(async ({ input }) => {
            const { pageSize, cursor, departmentCode, search } = input;

            const conditions = [];

            if (departmentCode) {
                conditions.push(eq(department.code, departmentCode));
            }

            if (search) {
                conditions.push(
                    or(
                        ilike(user.name, `%${search}%`),
                        ilike(user.email, `%${search}%`)
                    )
                );
            }

            if (cursor) {
                conditions.push(
                    or(
                        lt(advisor.createdAt, cursor.createdAt),
                        and(
                            eq(advisor.createdAt, cursor.createdAt),
                            lt(advisor.id, cursor.id)
                        )
                    )
                );
            }

            const where = conditions.length ? and(...conditions) : undefined;

            const rows = await db
                .select({
                    advisor,
                    user,
                    department,
                })
                .from(advisor)
                .innerJoin(user, eq(advisor.userId, user.id))
                .innerJoin(department, eq(advisor.departmentId, department.id))
                .where(where)
                .orderBy(desc(advisor.createdAt), desc(advisor.id))
                .limit(pageSize + 1);

            const hasNextPage = rows.length > pageSize;
            const items = hasNextPage ? rows.slice(0, pageSize) : rows;

            const nextCursor = hasNextPage
                ? {
                      createdAt: items[items.length - 1]!.advisor.createdAt,
                      id: items[items.length - 1]!.advisor.id,
                  }
                : null;

            return {
                items,
                nextCursor,
                hasNextPage,
            };
        }),

    getById: adminProcedure
        .input(getAdvisorByIdInputSchema)
        .query(async ({ input }) => {
            const { id } = input;

            const [uniqueAdvisor] = await db
                .select({
                    advisor,
                    user,
                    department,
                })
                .from(advisor)
                .innerJoin(user, eq(advisor.userId, user.id))
                .innerJoin(department, eq(advisor.departmentId, department.id))
                .where(eq(advisor.id, id))
                .limit(1);

            if (!uniqueAdvisor) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Advisor not found",
                });
            }

            return uniqueAdvisor;
        }),
});
