import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "@workspace/api/init";

export const studentProcedure = protectedProcedure.use(({ ctx, next }) => {
    if (ctx.session.user.role !== "STUDENT") {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Student access required.",
        });
    }

    return next();
});
