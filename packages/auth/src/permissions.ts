import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

type Mutable<T extends readonly string[]> = [...T];
export const ROLES = {
    ADMIN: "ADMIN",
    BATCHADVISOR: "BATCHADVISOR",
    INSTRUCTOR: "INSTRUCTOR",
    STUDENT: "STUDENT",
} as const;
export const ROLE_VALUES = Object.values(ROLES);
export type RoleType = keyof typeof ROLES;
export type PermissionStatement = typeof statement;
export type ResourceName = keyof PermissionStatement;
export type ResourceActions<T extends ResourceName> =
    PermissionStatement[T][number];
export type MultiplePermissions = Partial<{
    [K in ResourceName]: ResourceActions<K>[];
}>;

function perms<T extends readonly string[]>(p: T): Mutable<T> {
    return [...p];
}

const A = {
    READ: perms(["read"] as const),
    WRITE: perms(["create", "update", "delete"] as const),
    CRUD: perms(["create", "read", "update", "delete"] as const),
    MANAGE: perms(["manage"] as const),
    FULL: perms(["create", "read", "update", "delete", "manage"] as const),
};

export const statement = {
    ...defaultStatements,
    student: [...A.FULL, "assign"],
    instructor: [...A.FULL, "assign"],
    batch: [...A.FULL, "assign"],
    course: [...A.FULL, "assign"],
    courseOffering: [...A.FULL, "assign"],
    enrollment: [...A.FULL, "approve"],
    grade: [...A.FULL, "publish"],
    assessment: A.FULL,
    attendance: A.FULL,
    schedule: A.FULL,
    exam: A.FULL,
    examSchedule: A.FULL,
    department: A.FULL,
    program: A.FULL,
    feedback: A.FULL,
    announcement: A.FULL,
    reports: ["read", "export"],
    settings: ["read", "update"],
} as const;

export const ac = createAccessControl(statement);

export const ADMIN = ac.newRole({
    ...adminAc.statements,
    student: ["manage", "assign"],
    instructor: ["manage", "assign"],
    batch: ["manage", "assign"],
    course: ["manage", "assign"],
    courseOffering: ["manage", "assign"],
    grade: ["manage", "publish"],
    enrollment: ["manage", "approve"],
    assessment: A.MANAGE,
    attendance: A.MANAGE,
    schedule: A.MANAGE,
    exam: A.MANAGE,
    department: A.MANAGE,
    program: A.MANAGE,
    feedback: ["read", "delete"],
    announcement: A.MANAGE,
    reports: ["read", "export"],
    settings: ["read", "update"],
});

export const BATCHADVISOR = ac.newRole({
    student: ["read", "update"],
    batch: A.READ,
    instructor: A.READ,
    course: A.READ,
    courseOffering: A.READ,
    enrollment: A.READ,
    grade: A.READ,
    assessment: A.READ,
    attendance: A.READ,
    schedule: A.READ,
    exam: A.READ,
    department: A.READ,
    program: A.READ,
    feedback: A.READ,
    announcement: A.READ,
    reports: A.READ,
    settings: A.READ,
});

export const INSTRUCTOR = ac.newRole({
    student: A.READ,
    instructor: A.READ,
    batch: A.READ,
    course: A.READ,
    courseOffering: A.READ,
    enrollment: A.READ,
    grade: ["create", "update", "publish", "read"],
    assessment: ["create", "read", "update"],
    attendance: ["create", "read", "update"],

    schedule: A.READ,
    exam: A.READ,
    examSchedule: A.READ,
    department: A.READ,
    program: A.READ,
    feedback: A.READ,
    announcement: A.READ,
    reports: A.READ,
    settings: A.READ,
});

export const STUDENT = ac.newRole({
    student: A.READ,
    instructor: A.READ,
    batch: A.READ,
    course: A.READ,
    courseOffering: A.READ,
    enrollment: A.READ,
    grade: A.READ,
    assessment: A.READ,
    attendance: A.READ,
    schedule: A.READ,
    exam: A.READ,
    examSchedule: A.READ,
    department: A.READ,
    program: A.READ,
    feedback: ["create", "read"],
    announcement: A.READ,
    reports: A.READ,
    settings: A.READ,
});
