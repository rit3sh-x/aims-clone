"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
    createTRPCClient,
    httpSubscriptionLink,
    httpBatchLink,
    httpLink,
    splitLink,
    isNonJsonSerializable,
    type TRPCLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "@workspace/api";
import superjson from "superjson";
import { readSSROnlySecret } from "ssr-only-secrets";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

function getQueryClient(): QueryClient {
    if (typeof window === "undefined") return makeQueryClient();
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
}

function getUrl() {
    const base = (() => {
        if (typeof window !== "undefined") return "";
        return process.env.NEXT_PUBLIC_APP_URL!;
    })();
    return `${base}/api/trpc`;
}

export function TRPCReactProvider(props: {
    children: React.ReactNode;
    ssrOnlySecret: string;
}) {
    const queryClient = getQueryClient();

    const [trpcClient] = useState(() => {
        const httpLinkSingleInstance = httpLink({
            url: getUrl(),
            transformer: superjson,
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: "include",
                });
            },
            async headers() {
                const headers = new Headers();
                const secret = props.ssrOnlySecret;
                const value = await readSSROnlySecret(secret, "SECRET_CLIENT_COOKIE_VAR")
                if (value) {
                    headers.set("cookie", value);
                }
                return headers;
            },
        });

        const httpBatchLinkInstance = httpBatchLink({
            url: getUrl(),
            transformer: superjson,
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: "include",
                });
            },
            async headers() {
                const headers = new Headers();
                const secret = props.ssrOnlySecret;
                const value = await readSSROnlySecret(secret, "SECRET_CLIENT_COOKIE_VAR")
                if (value) {
                    headers.set("cookie", value);
                }
                return headers;
            },
        });

        const httpSubscriptionLinkInstance = httpSubscriptionLink({
            url: getUrl(),
            transformer: superjson,
        });

        const links: TRPCLink<AppRouter>[] = [
            splitLink({
                condition: (op) => op.type === "subscription",
                true: httpSubscriptionLinkInstance,
                false: splitLink({
                    condition: (op) => isNonJsonSerializable(op.input),
                    true: httpLinkSingleInstance,
                    false: httpBatchLinkInstance,
                }),
            }),
        ];

        return createTRPCClient<AppRouter>({ links });
    });

    return (
        <QueryClientProvider client={queryClient}>
            <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
                {props.children}
            </TRPCProvider>
        </QueryClientProvider>
    );
}