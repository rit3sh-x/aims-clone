import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import {
    createTRPCClient,
    httpBatchStreamLink,
    httpLink,
    splitLink,
    isNonJsonSerializable,
    loggerLink,
    unstable_localLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";
import {
    type AppRouter,
    appRouter,
    createTRPCContext as createTRPCServerContext,
} from "@workspace/api";

const BASE_URL: string = import.meta.env.VITE_APP_URL;

export const makeTRPCClient = createIsomorphicFn()
    .server(() => {
        return createTRPCClient<AppRouter>({
            links: [
                unstable_localLink({
                    router: appRouter,
                    transformer: SuperJSON,
                    createContext: () => {
                        const headers = new Headers(getRequestHeaders());
                        headers.set("x-trpc-source", "tanstack-start-server");
                        return createTRPCServerContext({ headers });
                    },
                }),
            ],
        });
    })
    .client(() => {
        const batch = httpBatchStreamLink({
            url: BASE_URL + "/api/trpc",
            transformer: SuperJSON,
            fetch(url, opts) {
                return fetch(url, { ...opts, credentials: "include" });
            },
        });

        const raw = httpLink({
            url: BASE_URL + "/api/trpc",
            fetch(url, opts) {
                return fetch(url, { ...opts, credentials: "include" });
            },
        });

        return createTRPCClient<AppRouter>({
            links: [
                loggerLink({
                    enabled: (op) =>
                        import.meta.env.DEV ||
                        (op.direction === "down" && op.result instanceof Error),
                }),

                splitLink({
                    condition: (op) => isNonJsonSerializable(op.input),
                    true: raw,
                    false: batch,
                }),
            ],
        });
    });

export const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>();
