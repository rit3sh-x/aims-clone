import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy } from "better-auth/plugins";
import { db } from "@workspace/db/client";

export const auth = betterAuth({
    database: drizzleAdapter(db, { provider: "pg" }),
    baseURL: process.env.NEXT_PUBLIC_APP_URL!,
    plugins: [
        oAuthProxy({ productionURL: process.env.NEXT_PUBLIC_APP_URL! }),
        expo(),
    ],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            redirectURI: `${process.env.NEXT_PUBLIC_APP_URL!}/api/auth/callback/google`,
        },
    },
    trustedOrigins: ["expo://", process.env.NEXT_PUBLIC_APP_URL!],
    onAPIError: {
        onError(error, ctx) {
            console.error("BETTER AUTH API ERROR", error, ctx);
        },
    },
});

export type Auth = typeof auth;
export type Session = Auth["$Infer"]["Session"];