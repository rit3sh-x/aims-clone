import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import { auditLog, db } from "@workspace/db";
import { TRPCError } from "@trpc/server";
import { listLogsInputSchema } from "../schema";

export const logsViewer = createTRPCRouter({
    list: adminProcedure.input(listLogsInputSchema).query(async ({ input }) => {
        const {
            page,
            pageSize,
            actorId,
            action,
            entityType,
            entityId,
            dateFrom,
            dateTo,
        } = input;

        if (dateFrom && dateTo && dateFrom > dateTo) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "dateFrom must be before dateTo",
            });
        }

        const limit = pageSize;
        const offset = (page - 1) * pageSize;

        const conditions = [];

        if (actorId) conditions.push(eq(auditLog.actorId, actorId));
        if (action) conditions.push(eq(auditLog.action, action));
        if (entityType) conditions.push(eq(auditLog.entityType, entityType));
        if (entityId) conditions.push(eq(auditLog.entityId, entityId));
        if (dateFrom) conditions.push(gte(auditLog.createdAt, dateFrom));
        if (dateTo) conditions.push(lte(auditLog.createdAt, dateTo));

        const where = conditions.length ? and(...conditions) : undefined;

        const [logs, total] = await Promise.all([
            db.query.auditLog.findMany({
                where,
                with: {
                    user: true,
                },
                orderBy: [desc(auditLog.createdAt)],
                limit,
                offset,
            }),

            db
                .select({ count: sql<number>`count(*)` })
                .from(auditLog)
                .where(where)
                .then((r) => r[0]?.count ?? 0),
        ]);

        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;

        return {
            logs,
            meta: {
                page,
                pageSize: limit,
                total,
                totalPages,
                hasNextPage,
            },
        };
    }),
});
