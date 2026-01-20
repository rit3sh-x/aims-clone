import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import { db, user, logAuditEvent, UserRole } from "@workspace/db";
import { auth } from "@workspace/auth";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { randomHex } from "../utils";
import {
    banUserInputSchema,
    createUserInputSchema,
    createUserOutputSchema,
    listUserSessionsInputSchema,
    revokeUserSessionInputSchema,
    revokeUserSessionsInputSchema,
    toggleDiableUserInputSchema,
    unbanUserInputSchema,
    updateUserInputSchema,
    updateUserOutputSchema,
} from "../schema";

export const userManagement = createTRPCRouter({
    createUser: adminProcedure
        .input(createUserInputSchema)
        .output(createUserOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const { headers, session } = ctx;
            const { email, name, role } = input;

            const beforeUser = await db.query.user.findFirst({
                where: (u, { eq }) => eq(u.email, email),
            });

            if (beforeUser) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "User email already exists",
                });
            }

            const { user: createdUser } = await auth.api.createUser({
                body: {
                    email,
                    name,
                    role,
                    password: randomHex(),
                },
                headers,
            });

            if (!createdUser) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create user",
                });
            }

            const userRole = createdUser.role as UserRole;

            if (!userRole) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Auth service returned user without role",
                });
            }

            await logAuditEvent({
                action: "CREATE",
                userId: session.user.id,
                entityType: "USER",
                entityId: createdUser.id,
                after: createdUser,
            });

            return {
                id: createdUser.id,
                email: createdUser.email,
                name: createdUser.name,
                role: userRole,
                image: createdUser.image ?? null,
                createdAt: createdUser.createdAt,
                updatedAt: createdUser.updatedAt,
            };
        }),
    update: adminProcedure
        .input(updateUserInputSchema)
        .output(updateUserOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const { id, ...data } = input;
            const { session } = ctx;

            const beforeUser = await db.query.user.findFirst({
                where: (u, { eq }) => eq(u.id, id),
            });

            if (!beforeUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            const [afterUser] = await db
                .update(user)
                .set({
                    ...(data.name !== undefined && { name: data.name }),
                    ...(data.email !== undefined && { email: data.email }),
                    ...(data.role !== undefined && { role: data.role }),
                    ...(data.disabled !== undefined && {
                        disabled: data.disabled,
                    }),
                    updatedAt: new Date(),
                })
                .where(eq(user.id, id))
                .returning();

            if (!afterUser) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update user",
                });
            }

            await logAuditEvent({
                action: "UPDATE",
                userId: session.user.id,
                entityType: "USER",
                entityId: id,
                before: beforeUser,
                after: afterUser,
            });

            return {
                ...afterUser,
            };
        }),

    ban: adminProcedure
        .input(banUserInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { headers, session } = ctx;
            const { id, reason, expiresIn } = input;

            const beforeUser = await db.query.user.findFirst({
                where: (u, { eq }) => eq(u.id, id),
            });

            if (!beforeUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            const newUser = await auth.api.banUser({
                body: {
                    userId: id,
                    banExpiresIn: expiresIn,
                    banReason: reason,
                },
                headers,
            });

            await logAuditEvent({
                action: "BANNED",
                entityType: "USER",
                userId: session.user.id,
                before: beforeUser,
                after: newUser,
                entityId: id,
            });
        }),

    unban: adminProcedure
        .input(unbanUserInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { headers, session } = ctx;
            const { id } = input;

            const beforeUser = await db.query.user.findFirst({
                where: (u, { eq }) => eq(u.id, id),
            });

            if (!beforeUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            const newUser = await auth.api.unbanUser({
                body: {
                    userId: id,
                },
                headers,
            });

            await logAuditEvent({
                action: "UNBANNED",
                entityType: "USER",
                userId: session.user.id,
                before: beforeUser,
                after: newUser,
                entityId: id,
            });
        }),

    toggle: adminProcedure
        .input(toggleDiableUserInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { id } = input;
            const { session } = ctx;

            const beforeUser = await db.query.user.findFirst({
                where: (u, { eq }) => eq(u.id, id),
            });

            if (!beforeUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            const nextDisabledState = !beforeUser.disabled;

            const [afterUser] = await db
                .update(user)
                .set({
                    disabled: nextDisabledState,
                    updatedAt: new Date(),
                })
                .where(eq(user.id, id))
                .returning();

            if (!afterUser) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update user state",
                });
            }

            await logAuditEvent({
                action: nextDisabledState ? "DISABLE" : "ENABLE",
                userId: session.user.id,
                entityType: "USER",
                entityId: id,
                before: beforeUser,
                after: afterUser,
            });

            return afterUser;
        }),

    listUserSessions: adminProcedure
        .input(listUserSessionsInputSchema)
        .query(async ({ input, ctx }) => {
            const { id } = input;
            const { headers } = ctx;

            const beforeUser = await db.query.user.findFirst({
                where: (u, { eq }) => eq(u.id, id),
            });

            if (!beforeUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            const { sessions } = await auth.api.listUserSessions({
                body: {
                    userId: id,
                },
                headers,
            });

            return sessions;
        }),

    revokeSession: adminProcedure
        .input(revokeUserSessionInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { sessionToken } = input;
            const { headers, session } = ctx;

            await auth.api.revokeUserSession({
                body: { sessionToken },
                headers,
            });

            await logAuditEvent({
                action: "REVOKE_SESSION",
                userId: session.user.id,
                entityType: "SESSION",
                entityId: sessionToken,
            });
        }),

    revokeAllSessions: adminProcedure
        .input(revokeUserSessionsInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { userId } = input;
            const { headers, session } = ctx;

            const beforeUser = await db.query.user.findFirst({
                where: (u, { eq }) => eq(u.id, userId),
            });

            if (!beforeUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            await auth.api.revokeUserSessions({
                body: { userId },
                headers,
            });

            await logAuditEvent({
                action: "REVOKE_ALL_SESSIONS",
                userId: session.user.id,
                entityType: "USER",
                entityId: userId,
                after: { sessionsRevoked: true },
            });
        }),
});
