import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "@workspace/api/init";

export const advisorProcedure = protectedProcedure.use(({ ctx, next }) => {
    if (ctx.session.user.role !== "BATCHADVISOR") {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Advisor access required.",
        });
    }

    return next();
});
