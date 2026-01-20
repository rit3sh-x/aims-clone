import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "@workspace/api/init";

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
    if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required.",
        });
    }

    return next();
});
