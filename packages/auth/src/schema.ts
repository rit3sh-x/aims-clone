import { createAccessControl, type Role } from "better-auth/plugins/access";

export const ROLES = {
    ADMIN: "ADMIN",
    ADVISOR: "ADVISOR",
    HOD: "HOD",
    INSTRUCTOR: "INSTRUCTOR",
    STUDENT: "STUDENT",
} as const;

export const ROLE_VALUES = Object.values(ROLES) as [string, ...string[]];

const statement = {
    user: ["create", "list", "update", "delete", "ban", "impersonate"],
    session: ["list", "terminate"],
} as const;

export const ac = createAccessControl(statement);

export const ROLE_MAP = {
    [ROLES.ADMIN]: ac.newRole({
        user: ["create", "list", "update", "delete", "ban", "impersonate"],
        session: ["list", "terminate"],
    }),
    [ROLES.ADVISOR]: ac.newRole({}),
    [ROLES.HOD]: ac.newRole({}),
    [ROLES.INSTRUCTOR]: ac.newRole({}),
    [ROLES.STUDENT]: ac.newRole({}),
} as Record<string, Role>;
