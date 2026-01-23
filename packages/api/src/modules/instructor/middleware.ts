import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "@workspace/api/init";
import { db } from "@workspace/db";

export const instructorProcedure = protectedProcedure.use(
    async ({ ctx, next }) => {
        const userId = ctx.session.user.id;

        if (ctx.session.user.role !== "INSTRUCTOR") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Instructor access required.",
            });
        }

        const instructorRecord = await db.query.hod.findFirst({
            where: (h, { eq }) => eq(h.userId, userId),
            columns: {
                id: true,
                departmentId: true,
            },
        });

        if (!instructorRecord) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "HOD record not found.",
            });
        }

        return next({
            ctx: {
                ...ctx,
                instructor: instructorRecord,
            },
        });
    }
);
