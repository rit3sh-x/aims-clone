import { expo } from "@better-auth/expo";
import { type BetterAuthOptions } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy, twoFactor, admin, emailOTP } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db, logAuditEvent, schema } from "@workspace/db";
import { sendLoginOTP, sendPasswordResetEmail } from "@workspace/infra";
import { ROLE_VALUES, ROLES, ac, ROLE_MAP } from "./schema";

const appUrl = process.env.VITE_APP_URL;
const isProd = process.env.NODE_ENV === "production";

export const options = {
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    baseURL: appUrl,
    plugins: [
        admin({
            ac,
            adminRoles: "ADMIN",
            defaultRole: ROLES.STUDENT,
            roles: ROLE_MAP,
        }),
        twoFactor({
            otpOptions: {
                async sendOTP({ user, otp }) {
                    console.log(otp);
                    await sendLoginOTP(user.email, otp);
                },
                digits: 6,
                storeOTP: "encrypted",
                period: 300,
            },
            issuer: "AIMS Portal",
            skipVerificationOnEnable: true,
        }),
        emailOTP({
            allowedAttempts: 5,
            expiresIn: 300,
            storeOTP: "encrypted",
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "forget-password") {
                    await sendPasswordResetEmail(email, otp);
                }
            },
        }),
        oAuthProxy({ productionURL: appUrl }),
        expo(),
        tanstackStartCookies(),
    ] as const,
    rateLimit: {
        storage: "memory" as const,
        enabled: isProd,
        window: 60,
        max: 100,
        customRules: {
            "/sign-in/email": { window: 15, max: 5 },
            "/email-otp/send-verification-otp": { window: 10, max: 3 },
            "/two-factor/verify": { window: 10, max: 5 },
            "/callback/*": { window: 10, max: 10 },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        disableSignUp: true,
        requireEmailVerification: false,
    },
    socialProviders: {
        google: {
            prompt: "select_account" as const,
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    advanced: {
        cookiePrefix: "aims",
        cookies: {
            sessionToken: {
                attributes: {
                    maxAge: undefined,
                    secure: isProd,
                    sameSite: "Lax" as const,
                    httpOnly: true,
                },
            },
        },
        database: {
            generateId: "uuid" as const,
        },
    },
    trustedOrigins: [
        ...(process.env.MOBILE_SCHEMES?.split(",") || []),
        ...(appUrl ? [appUrl] : []),
    ],
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
    },
    onAPIError: {
        onError(error, ctx) {
            console.error("BETTER AUTH API ERROR:", error, ctx);
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"] as const,
        },
    },
    user: {
        additionalFields: {
            disabled: {
                type: "boolean" as const,
                defaultValue: false,
                input: false,
            },
            role: {
                type: ROLE_VALUES,
                defaultValue: ROLES.STUDENT,
                input: false,
                required: true,
            },
        },
    },
    hooks: {
        before: createAuthMiddleware(async ({ path, context }) => {
            if (context.session?.user?.banned) {
                throw new APIError("FORBIDDEN", {
                    message:
                        context.session.user.banReason ||
                        "This account has been disabled.",
                });
            }
            if (
                context.session?.user &&
                context.session.user.disabled === true
            ) {
                throw new APIError("FORBIDDEN", {
                    message:
                        "Access denied. Graduated accounts are deactivated.",
                });
            }
            if (path === "/sign-up/email") {
                throw new APIError("FORBIDDEN", {
                    message: "Account creation is restricted to administrators",
                });
            }
            if (
                path === "/two-factor/enable" ||
                path === "/two-factor/disable"
            ) {
                throw new APIError("FORBIDDEN", {
                    message: "2FA cannot be modified",
                });
            }
        }),
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const emailDomain = user.email.split("@")[1];
                    if (!emailDomain) {
                        throw new APIError("FORBIDDEN", {
                            message: "Email is invalid",
                        });
                    }
                    const allowedDomains =
                        process.env.ALLOWED_EMAIL_DOMAINS?.split(",") || [];
                    if (
                        allowedDomains.length > 0 &&
                        !allowedDomains.includes(emailDomain.toLowerCase())
                    ) {
                        throw new APIError("FORBIDDEN", {
                            message: `Email domain ${emailDomain} is not allowed`,
                        });
                    }
                    return {
                        data: {
                            ...user,
                            twoFactorEnabled: true,
                            emailVerified: true,
                        },
                    };
                },
                after: async (user) => {
                    await logAuditEvent({
                        userId: user.id,
                        action: "CREATE",
                        entityType: "USER",
                        entityId: user.id,
                        before: {},
                        after: user,
                    });
                },
            },
            update: {
                after: async (user) => {
                    await logAuditEvent({
                        userId: user.id,
                        action: "UPDATE",
                        entityType: "USER",
                        entityId: user.id,
                    });
                },
            },
        },
        session: {
            create: {
                after: async (session) => {
                    await logAuditEvent({
                        userId: session.userId,
                        action: "CREATE",
                        entityType: "SESSION",
                        entityId: session.id,
                        ipAddress: session.ipAddress,
                        userAgent: session.userAgent,
                    });
                },
            },
        },
    },
} satisfies BetterAuthOptions;
