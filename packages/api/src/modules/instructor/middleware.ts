import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "@workspace/api/init";

export const instructorProcedure = protectedProcedure.use(({ ctx, next }) => {
    if (ctx.session.user.role !== "INSTRUCTOR") {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Instructor access required.",
        });
    }

    return next();
});
