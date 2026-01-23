import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    classroomListInputSchema,
    createClassroomInputSchema,
    deleteClassroomInputSchema,
    updateClassroomInputSchema,
} from "../schema";
import { and, asc, eq, gt, ilike, or, sql } from "drizzle-orm";
import { classroom, db, logAuditEvent } from "@workspace/db";
import { TRPCError } from "@trpc/server";

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

    create: adminProcedure
        .input(createClassroomInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { room, type, building, capacity } = input;
            const { user } = ctx.session;
            const [created] = await db
                .insert(classroom)
                .values({
                    id: crypto.randomUUID(),
                    room,
                    building,
                    capacity,
                    type,
                })
                .returning();

            if (!created) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create classroom",
                });
            }

            await logAuditEvent({
                userId: user.id,
                action: "CREATE",
                entityType: "CLASSROOM",
                entityId: created.id,
                after: created,
            });

            return created;
        }),

    update: adminProcedure
        .input(updateClassroomInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { roomCode, ...data } = input;
            const { user } = ctx.session;

            const existing = await db.query.classroom.findFirst({
                where: eq(classroom.room, roomCode),
            });

            if (!existing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Classroom with room code '${roomCode}' not found`,
                });
            }

            const [updated] = await db
                .update(classroom)
                .set(data)
                .where(eq(classroom.room, roomCode))
                .returning();

            await logAuditEvent({
                userId: user.id,
                action: "UPDATE",
                entityType: "CLASSROOM",
                entityId: existing.id,
                before: existing,
                after: updated,
            });

            return updated;
        }),

    delete: adminProcedure
        .input(deleteClassroomInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { roomCode } = input;
            const { user } = ctx.session;

            const existing = await db.query.classroom.findFirst({
                where: eq(classroom.room, roomCode),
            });

            if (!existing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Classroom with room code '${roomCode}' not found`,
                });
            }

            const [deleted] = await db
                .delete(classroom)
                .where(eq(classroom.room, roomCode))
                .returning();

            if (!deleted) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to delete classroom",
                });
            }

            await logAuditEvent({
                userId: user.id,
                action: "DELETE",
                entityType: "CLASSROOM",
                entityId: existing.id,
                before: existing,
            });

            return deleted;
        }),
});
