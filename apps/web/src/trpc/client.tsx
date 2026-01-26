"use client";

import type { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
    createTRPCClient,
    httpBatchStreamLink,
    httpLink,
    isNonJsonSerializable,
    loggerLink,
    splitLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";
import type { AppRouter } from "@workspace/api";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;

const getQueryClient = () => {
    if (typeof window === "undefined") {
        return createQueryClient();
    } else {
        return (clientQueryClientSingleton ??= createQueryClient());
    }
};

export const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    const batch = httpBatchStreamLink({
        url: getUrl(),
        transformer: SuperJSON,
        fetch(url, opts) {
            return fetch(url, { ...opts, credentials: "include" });
        },
    });

    const raw = httpLink({
        url: getUrl(),
        fetch(url, opts) {
            return fetch(url, { ...opts, credentials: "include" });
        },
    });

    const [trpcClient] = useState(() =>
        createTRPCClient<AppRouter>({
            links: [
                loggerLink({
                    enabled: (op) =>
                        process.env.NODE_ENV === "development" ||
                        (op.direction === "down" && op.result instanceof Error),
                }),
                splitLink({
                    condition: (op) => isNonJsonSerializable(op.input),
                    true: raw,
                    false: batch,
                }),
            ],
        })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
                {props.children}
            </TRPCProvider>
        </QueryClientProvider>
    );
}

function getUrl() {
    const base = (() => {
        if (typeof window !== "undefined") return "";
        return process.env.NEXT_PUBLIC_APP_URL;
    })();
    return `${base}/api/trpc`;
}
