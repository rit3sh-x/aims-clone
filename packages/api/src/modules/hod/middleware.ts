import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "@workspace/api/init";
import { db } from "@workspace/db";

export const hodProcedure = protectedProcedure.use(async ({ ctx, next }) => {
    const userId = ctx.session.user.id;

    if (ctx.session.user.role !== "HOD") {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "HOD access required.",
        });
    }

    const hodRecord = await db.query.hod.findFirst({
        where: (h, { eq }) => eq(h.userId, userId),
        columns: {
            id: true,
            departmentId: true,
        },
    });

    if (!hodRecord) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "HOD record not found.",
        });
    }

    return next({
        ctx: {
            ...ctx,
            hod: hodRecord,
        },
    });
});
