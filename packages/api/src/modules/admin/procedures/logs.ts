import { and, desc, eq, gte, lt, lte, or } from "drizzle-orm";
import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import { auditLog, db } from "@workspace/db";
import { TRPCError } from "@trpc/server";
import { listLogsInputSchema } from "../schema";

export const logsViewer = createTRPCRouter({
    list: adminProcedure.input(listLogsInputSchema).query(async ({ input }) => {
        const { pageSize, cursor, action, entityType, dateFrom, dateTo } =
            input;

        if (dateFrom && dateTo && dateFrom > dateTo) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "dateFrom must be before dateTo",
            });
        }

        const conditions = [];

        if (action) conditions.push(eq(auditLog.action, action));
        if (entityType) conditions.push(eq(auditLog.entityType, entityType));
        if (dateFrom) conditions.push(gte(auditLog.createdAt, dateFrom));
        if (dateTo) conditions.push(lte(auditLog.createdAt, dateTo));
        if (cursor) {
            conditions.push(
                or(
                    lt(auditLog.createdAt, cursor.createdAt),
                    and(
                        eq(auditLog.createdAt, cursor.createdAt),
                        lt(auditLog.id, cursor.id)
                    )
                )
            );
        }

        const where = conditions.length ? and(...conditions) : undefined;

        const logs = await db.query.auditLog.findMany({
            where,
            with: { user: true },
            orderBy: [desc(auditLog.createdAt), desc(auditLog.id)],
            limit: pageSize + 1,
        });

        const hasNextPage = logs.length > pageSize;
        const items = hasNextPage ? logs.slice(0, pageSize) : logs;

        const nextCursor = hasNextPage
            ? {
                  createdAt: items[items.length - 1]!.createdAt,
                  id: items[items.length - 1]!.id,
              }
            : null;

        return {
            logs: items,
            nextCursor,
            hasNextPage,
        };
    }),
});
