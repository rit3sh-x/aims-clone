import { createAuthClient } from "better-auth/react";
import {
    inferAdditionalFields,
    emailOTPClient,
    twoFactorClient,
    adminClient,
    customSessionClient,
} from "better-auth/client/plugins";
import type { Auth } from "@workspace/auth";
import { toast } from "sonner";

export const authClient = createAuthClient({
    baseURL: process.env.VITE_APP_URL!,
    plugins: [
        inferAdditionalFields<Auth>(),
        customSessionClient<Auth>(),
        emailOTPClient(),
        adminClient(),
        twoFactorClient(),
    ],
    fetchOptions: {
        onError: async (context: { response: Response }) => {
            if (context.response.status === 429) {
                const retryAfter =
                    context.response.headers.get("X-Retry-After");
                toast.error("Rate limit exceeded.", {
                    description: `Retry after ${retryAfter || 60} seconds`,
                });
            }
        },
    },
});
