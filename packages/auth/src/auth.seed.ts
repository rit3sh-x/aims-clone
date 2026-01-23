import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db, schema } from "@workspace/db";
import { ROLE_VALUES, ROLES, ROLE_MAP, ac } from "./schema";

export const authSeed = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    plugins: [
        admin({
            ac,
            adminRoles: [ROLES.ADMIN],
            defaultRole: ROLES.STUDENT,
            roles: ROLE_MAP,
        }),
    ],
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        disableSignUp: false,
        requireEmailVerification: false,
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },
    user: {
        additionalFields: {
            disabled: {
                type: "boolean",
                defaultValue: false,
                input: false,
            },
            role: {
                type: ROLE_VALUES,
                defaultValue: ROLES.STUDENT,
                input: false,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    return {
                        data: {
                            ...user,
                            twoFactorEnabled: true,
                            emailVerified: true,
                        },
                    };
                },
            },
        },
    },
});
