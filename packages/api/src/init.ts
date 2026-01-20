import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import { z, ZodError } from "zod";
import { auth } from "@workspace/auth";

export const createTRPCContext = cache(async (opts: { headers: Headers }) => {
    const { headers } = opts;

    const session = await auth.api.getSession({
        headers,
    });

    return {
        session,
        headers,
    };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter: ({ shape, error }) => ({
        ...shape,
        data: {
            ...shape.data,
            zodError:
                error.cause instanceof ZodError
                    ? z.flattenError(
                          error.cause as ZodError<Record<string, unknown>>
                      )
                    : null,
        },
    }),
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
    const { session } = ctx;
    if (!session) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User isn't logged in.",
        });
    }

    if (session.user.banned || session.user.disabled) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "User is restricted from logging in.",
        });
    }

    return next({
        ctx: {
            ...ctx,
            session: { ...session, user: session.user },
        },
    });
});
