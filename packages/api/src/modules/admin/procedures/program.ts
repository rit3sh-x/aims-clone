import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    createProgramSchema,
    deleteProgramSchema,
    listProgramsInputSchema,
    updateProgramSchema,
} from "../schema";
import { and, asc, eq, ilike, or } from "drizzle-orm";
import { db, logAuditEvent, program } from "@workspace/db";
import { TRPCError } from "@trpc/server";

export const programManagement = createTRPCRouter({
    list: adminProcedure
        .input(listProgramsInputSchema)
        .query(async ({ input }) => {
            const { departmentId, search, page, pageSize } = input;
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

            const items = await db.query.program.findMany({
                where: conditions.length ? and(...conditions) : undefined,
                with: { department: true },
                orderBy: [asc(program.code)],
                limit: pageSize + 1,
                offset: (page - 1) * pageSize,
            });

            const hasNextPage = items.length > pageSize;

            return {
                items: hasNextPage ? items.slice(0, pageSize) : items,
                page,
                pageSize,
                hasNextPage,
            };
        }),

    create: adminProcedure
        .input(createProgramSchema)
        .mutation(async ({ input, ctx }) => {
            const { code, degree, departmentId, name } = input;
            const { user } = ctx.session;
            const [createdProgram] = await db
                .insert(program)
                .values({
                    code,
                    degree,
                    departmentId,
                    name,
                    id: crypto.randomUUID(),
                })
                .returning();

            if (!createdProgram) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Unable to create program",
                });
            }

            await logAuditEvent({
                userId: user.id,
                action: "CREATE",
                entityType: "USER",
                entityId: createdProgram.id,
                after: createdProgram,
            });

            return createdProgram;
        }),

    update: adminProcedure
        .input(updateProgramSchema)
        .mutation(async ({ input, ctx }) => {
            const { id, ...data } = input;
            const { user } = ctx.session;
            const beforeProgram = await db.query.program.findFirst({
                where: (p, { eq }) => eq(p.id, id),
            });

            if (!beforeProgram) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No program found",
                });
            }

            const [afterProgram] = await db
                .update(program)
                .set(data)
                .where(eq(program.id, id))
                .returning();

            await logAuditEvent({
                userId: user.id,
                action: "UPDATE",
                entityType: "PROGRAM",
                entityId: id,
                after: afterProgram,
                before: beforeProgram,
            });

            return afterProgram;
        }),

    delete: adminProcedure
        .input(deleteProgramSchema)
        .mutation(async ({ input, ctx }) => {
            const { id } = input;
            const { user } = ctx.session;

            const beforeProgram = await db.query.program.findFirst({
                where: (p, { eq }) => eq(p.id, id),
            });

            if (!beforeProgram) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No program found",
                });
            }

            const [deleted] = await db
                .delete(program)
                .where(eq(program.id, id))
                .returning();

            await logAuditEvent({
                userId: user.id,
                action: "DELETE",
                entityType: "PROGRAM",
                entityId: id,
                after: deleted,
                before: beforeProgram,
            });

            return deleted;
        }),
});
