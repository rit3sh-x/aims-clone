import { pgEnum } from "drizzle-orm/pg-core";

export const auditActionEnum = pgEnum("audit_action", [
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
]);
export type AuditAction = (typeof auditActionEnum.enumValues)[number];

export const auditEntityEnum = pgEnum("audit_entity", [
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
]);
export type AuditEntity = (typeof auditEntityEnum.enumValues)[number];

export const userRoleEnum = pgEnum("role", [
    "ADMIN",
    "HOD",
    "ADVISOR",
    "INSTRUCTOR",
    "STUDENT",
]);
export type UserRole = (typeof userRoleEnum.enumValues)[number];

export const degreeTypeEnum = pgEnum("degree_type", [
    "BACHELOR",
    "MASTER",
    "DIPLOMA",
    "PHD",
]);
export type DegreeType = (typeof degreeTypeEnum.enumValues)[number];

export const semesterTypeEnum = pgEnum("semester_code", [
    "ODD",
    "SUMMER",
    "EVEN",
]);
export type SemesterType = (typeof semesterTypeEnum.enumValues)[number];

export const courseStatusEnum = pgEnum("course_status", [
    "PROPOSED",
    "REJECTED",
    "HOD_ACCEPTED",
    "ADMIN_ACCEPTED",
]);
export type CourseStatus = (typeof courseStatusEnum.enumValues)[number];

export const offeringStatusEnum = pgEnum("offering_status", [
    "PROPOSED",
    "REJECTED",
    "ENROLLING",
    "ONGOING",
    "COMPLETED",
    "CANCELLED",
]);
export type OfferingStatus = (typeof offeringStatusEnum.enumValues)[number];

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
    "PENDING",
    "INSTRUCTOR_APPROVED",
    "INSTRUCTOR_REJECTED",
    "ADVISOR_APPROVED",
    "ADVISOR_REJECTED",
    "ENROLLED",
    "DROPPED",
    "COMPLETED",
]);
export type EnrollmentStatus = (typeof enrollmentStatusEnum.enumValues)[number];

export const attendanceStatusEnum = pgEnum("attendance_status", [
    "PRESENT",
    "ABSENT",
    "EXCUSED",
]);
export type AttendanceStatus = (typeof attendanceStatusEnum.enumValues)[number];

export const attendanceTypeEnum = pgEnum("attendance_type", [
    "LECTURE",
    "TUTORIAL",
    "LAB",
]);
export type AttendanceType = (typeof attendanceTypeEnum.enumValues)[number];

export const assessmentTypeEnum = pgEnum("assessment_type", [
    "QUIZ",
    "MIDTERM",
    "ASSIGNMENT",
    "LAB",
    "PROJECT",
    "ENDTERM",
]);
export type AssesmentType = (typeof assessmentTypeEnum.enumValues)[number];

export const gradeTypeEnum = pgEnum("grade_type", [
    "A",
    "A-",
    "B",
    "B-",
    "C",
    "C-",
    "D",
    "E",
    "F",
]);
export type GradeType = (typeof gradeTypeEnum.enumValues)[number];

export const classroomTypeEnum = pgEnum("classroom_type", [
    "LECTURE",
    "LAB",
    "SEMINAR",
]);
export type ClassroomType = (typeof classroomTypeEnum.enumValues)[number];

export const semesterStatusEnum = pgEnum("semester_status", [
    "UPCOMING",
    "ONGOING",
    "COMPLETED",
]);
export type SemesterStatus = (typeof semesterStatusEnum.enumValues)[number];

export const dayOfWeekEnum = pgEnum("day_of_week", [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
]);

export const sessionTypeEnum = pgEnum("session_type", [
    "THEORY",
    "TUTORIAL",
    "LAB",
]);

export const theoryPeriodEnum = pgEnum("theory_period", [
    "PC-1",
    "PC-2",
    "PC-3",
    "PC-4",
    "PCPE",
    "HSME",
    "PCPE_PM",
    "HSPE",
    "PHSME",
    "PCDE",
    "PEOE",
    "PCE-1",
    "PCE-2",
    "PCE-3",
    "S",
    "T-PCOE",
]);

export const tutorialPeriodEnum = pgEnum("tutorial_period", [
    "T-PCPE",
    "T-HSPE",
    "T-PCDE",
    "T-PHSME",
    "T-POE",
    "T-PC-1",
    "T-PC-2",
    "T-PC-3",
    "T-PC-4",
    "T-HSME",
    "T-PMS",
    "T-S",
    "T-PCOE",
    "T-PEOE",
]);

export const labPeriodEnum = pgEnum("lab_period", [
    "LAB-2H-1",
    "LAB-2H-2",
    "LAB-2H-3",
    "LAB-2H-4",
    "LAB-2H-5",
    "LAB-2H-6",
    "LAB-2H-7",
    "LAB-2H-8",
    "LAB-2H-9",
    "LAB-2H-10",
    "LAB-3H-1",
    "LAB-3H-2",
    "LAB-3H-3",
    "LAB-3H-4",
    "LAB-3H-5",
    "LAB-3H-6",
    "LAB-4H-1",
    "LAB-4H-2",
    "LAB-4H-3",
    "LAB-4H-4",
    "LAB-4H-5",
    "LAB-4H-6",
    "NCC/NSO/NSS",
]);
