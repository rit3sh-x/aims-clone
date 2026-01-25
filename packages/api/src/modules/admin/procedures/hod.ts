import { createTRPCRouter } from "@workspace/api/init";
import { getHodByIdInputSchema, listHodsInputSchema } from "../schema";
import { adminProcedure } from "../middleware";
import { db, hod, department, user } from "@workspace/db";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const hodManagement = createTRPCRouter({
    list: adminProcedure.input(listHodsInputSchema).query(async ({ input }) => {
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
                    lt(hod.createdAt, cursor.createdAt),
                    and(
                        eq(hod.createdAt, cursor.createdAt),
                        lt(hod.id, cursor.id)
                    )
                )
            );
        }

        const where = conditions.length ? and(...conditions) : undefined;

        const rows = await db
            .select({
                hod,
                user,
                department,
            })
            .from(hod)
            .innerJoin(user, eq(hod.userId, user.id))
            .innerJoin(department, eq(hod.departmentId, department.id))
            .where(where)
            .orderBy(desc(hod.createdAt), desc(hod.id))
            .limit(pageSize + 1);

        const hasNextPage = rows.length > pageSize;
        const items = hasNextPage ? rows.slice(0, pageSize) : rows;

        const nextCursor = hasNextPage
            ? {
                  createdAt: items[items.length - 1]!.hod.createdAt,
                  id: items[items.length - 1]!.hod.id,
              }
            : null;

        return {
            items,
            nextCursor,
            hasNextPage,
        };
    }),

    getById: adminProcedure
        .input(getHodByIdInputSchema)
        .query(async ({ input }) => {
            const { id } = input;

            const [uniqueHod] = await db
                .select({
                    hod,
                    user,
                    department,
                })
                .from(hod)
                .innerJoin(user, eq(hod.userId, user.id))
                .innerJoin(department, eq(hod.departmentId, department.id))
                .where(eq(hod.id, id))
                .limit(1);

            if (!uniqueHod) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "HOD not found",
                });
            }

            return uniqueHod;
        }),
});
