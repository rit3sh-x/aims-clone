import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import type { AppRouter } from "@workspace/api";
import { authClient } from "./auth-client";
import { getBaseUrl } from "./base-url";

export const queryClient = new QueryClient();

export const trpc = createTRPCOptionsProxy<AppRouter>({
    client: createTRPCClient({
        links: [
            httpBatchLink({
                transformer: superjson,
                url: `${getBaseUrl()}/api/trpc`,
                async headers() {
                    const headers: Record<string, string> = {
                        "x-trpc-source": "expo-react",
                    };

                    const cookies = authClient.getCookie();
                    if (cookies) {
                        headers["Cookie"] = cookies;
                    }

                    return headers;
                },
            }),
        ],
    }),
    queryClient,
});

export type { RouterInputs, RouterOutputs } from "@workspace/api";
