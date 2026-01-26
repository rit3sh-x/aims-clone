export const AUDIT_ACTIONS = [
    "CREATE",
    "UPDATE",
    "DELETE",
    "ENROLL",
    "UNENROLL",
    "GRADE_SUBMIT",
    "ATTENDANCE_MARK",
    "BANNED",
    "UNBANNED",
    "DISABLE",
    "ENABLE",
    "REVOKE_SESSION",
    "REVOKE_ALL_SESSIONS",
    "IMPERSONATE",
    "STOP_IMPERSONATE",
] as const;

export const AUDIT_ENTITIES = [
    "USER",
    "STUDENT",
    "INSTRUCTOR",
    "HOD",
    "ADVISOR",
    "SEMESTER",
    "COURSE",
    "COURSE_OFFERING",
    "ENROLLMENT",
    "ATTENDANCE",
    "GRADE",
    "SESSION",
    "DEPARTMENT",
    "PROGRAM",
    "BATCH",
    "CLASSROOM",
    "SCHEDULE",
    "TIME_SLOT",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];
export type AuditEntity = (typeof AUDIT_ENTITIES)[number];