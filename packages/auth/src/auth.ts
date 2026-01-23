import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";
import { ROLES } from "./schema";
import { options } from "./options";

export const auth = betterAuth({
    ...options,
    plugins: [
        ...(options.plugins || []),
        customSession(async ({ user, session }) => {
            return {
                user: {
                    ...user,
                    role: user.role as keyof typeof ROLES,
                    banned: user.banned ?? false,
                    disabled: user.disabled ?? false,
                    twoFactorEnabled: true,
                },
                session,
            };
        }, options),
    ],
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
