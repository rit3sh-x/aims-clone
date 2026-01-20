import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    classroomListInputSchema,
    createClassroomInputSchema,
    deleteClassroomInputSchema,
    updateClassroomInputSchema,
} from "../schema";
import { and, asc, eq, ilike, or, sql } from "drizzle-orm";
import { classroom, db, logAuditEvent } from "@workspace/db";
import { TRPCError } from "@trpc/server";

export const classroomManagement = createTRPCRouter({
    list: adminProcedure
        .input(classroomListInputSchema)
        .query(async ({ input }) => {
            const { page, pageSize, type, search } = input;

            const limit = pageSize;
            const offset = (page - 1) * pageSize;

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

            const where = conditions.length ? and(...conditions) : undefined;

            const [items, total] = await Promise.all([
                db.query.classroom.findMany({
                    where,
                    orderBy: [asc(classroom.room)],
                    limit,
                    offset,
                }),
                db
                    .select({ count: sql<number>`count(*)` })
                    .from(classroom)
                    .where(where)
                    .then((r) => r[0]?.count ?? 0),
            ]);

            return {
                items,
                meta: {
                    page,
                    pageSize: limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
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
            const { id, ...data } = input;
            const { user } = ctx.session;

            const existing = await db.query.classroom.findFirst({
                where: eq(classroom.id, id),
            });

            if (!existing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Classroom not found",
                });
            }

            const [updated] = await db
                .update(classroom)
                .set(data)
                .where(eq(classroom.id, id))
                .returning();

            await logAuditEvent({
                userId: user.id,
                action: "UPDATE",
                entityType: "CLASSROOM",
                entityId: id,
                before: existing,
                after: updated,
            });

            return updated;
        }),

    delete: adminProcedure
        .input(deleteClassroomInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { id } = input;
            const { user } = ctx.session;

            const existing = await db.query.classroom.findFirst({
                where: eq(classroom.id, id),
            });

            if (!existing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Classroom not found",
                });
            }

            const [deleted] = await db
                .delete(classroom)
                .where(eq(classroom.id, id))
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
                entityId: id,
                before: existing,
            });

            return deleted;
        }),
});
