import { type BetterAuthOptions } from "better-auth";
import { twoFactor, admin, emailOTP } from "better-auth/plugins";
import { ROLE_VALUES, ROLES, ac, ROLE_MAP } from "./schema";

export const options = {
    plugins: [
        admin({
            ac,
            adminRoles: "ADMIN",
            defaultRole: ROLES.STUDENT,
            roles: ROLE_MAP,
        }),
        twoFactor({
            otpOptions: {
                async sendOTP() {},
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
            async sendVerificationOTP() {},
        }),
    ] as const,
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
} satisfies BetterAuthOptions;

export type Auth = typeof options;
