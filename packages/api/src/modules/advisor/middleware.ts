import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "@workspace/api/init";
import { db } from "@workspace/db";

export const advisorProcedure = protectedProcedure.use(
    async ({ ctx, next }) => {
        const userId = ctx.session.user.id;

        if (ctx.session.user.role !== "ADVISOR") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Advisor access required.",
            });
        }

        const advisorRecord = await db.query.hod.findFirst({
            where: (h, { eq }) => eq(h.userId, userId),
            columns: {
                id: true,
                departmentId: true,
            },
        });

        if (!advisorRecord) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "HOD record not found.",
            });
        }

        return next({
            ctx: {
                ...ctx,
                advisor: advisorRecord,
            },
        });
    }
);
