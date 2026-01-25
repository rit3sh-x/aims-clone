import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    classroomListInputSchema,
} from "../schema";
import { and, asc, eq, gt, ilike, or } from "drizzle-orm";
import { classroom, db } from "@workspace/db";

export const classroomManagement = createTRPCRouter({
    list: adminProcedure
        .input(classroomListInputSchema)
        .query(async ({ input }) => {
            const { pageSize, type, search, cursor } = input;

            const conditions = [];

            if (type) {
                conditions.push(eq(classroom.type, type));
            }

            if (search) {
                conditions.push(
                    or(
                        ilike(classroom.room, `%${search}%`),
                        ilike(classroom.building, `%${search}%`)
                    )
                );
            }

            if (cursor) {
                conditions.push(
                    or(
                        gt(classroom.room, cursor.room),
                        and(
                            eq(classroom.room, cursor.room),
                            gt(classroom.id, cursor.id)
                        )
                    )
                );
            }

            const where = conditions.length ? and(...conditions) : undefined;

            const rows = await db.query.classroom.findMany({
                where,
                orderBy: [asc(classroom.room), asc(classroom.id)],
                limit: pageSize + 1,
            });

            const hasNextPage = rows.length > pageSize;
            const items = hasNextPage ? rows.slice(0, pageSize) : rows;

            const nextCursor = hasNextPage
                ? {
                    room: items[items.length - 1]!.room,
                    id: items[items.length - 1]!.id,
                }
                : null;

            return {
                items,
                nextCursor,
                hasNextPage,
            };
        }),
});
