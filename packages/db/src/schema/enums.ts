import { pgEnum } from "drizzle-orm/pg-core";

export const auditActionEnum = pgEnum("audit_action", [
    "CREATE",
    "UPDATE",
    "DELETE",
    "LOGIN",
    "LOGOUT",
    "PASSWORD_RESET",
    "ENROLL",
    "UNENROLL",
    "GRADE_SUBMIT",
    "ATTENDANCE_MARK",
    "ANNOUNCEMENT_POST",
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
    "SEMESTER",
    "COURSE",
    "COURSE_OFFERING",
    "ENROLLMENT",
    "ATTENDANCE",
    "GRADE",
    "ANNOUNCEMENT",
    "DOCUMENT",
    "SESSION",
    "DEPARTMENT",
    "PROGRAM",
    "BATCH",
    "CLASSROOM",
]);
export type AuditEntity = (typeof auditEntityEnum.enumValues)[number];

export const userRoleEnum = pgEnum("role", [
    "ADMIN",
    "BATCHADVISOR",
    "INSTRUCTOR",
    "STUDENT",
]);
export type UserRole = (typeof userRoleEnum.enumValues)[number];

export const departmentCodeEnum = pgEnum("department_code", [
    "CSE",
    "AI",
    "DS",
    "IT",
    "ECE",
    "EEE",
    "ME",
    "CE",
    "CHE",
    "META",
    "BIOTECH",
    "MATHS",
    "PHYS",
    "CHEM",
]);
export type DepartmentCode = (typeof departmentCodeEnum.enumValues)[number];

export const programDegreeEnum = pgEnum("program_degree", [
    "BTECH",
    "MTECH",
    "BSC",
    "MSC",
    "PHD",
]);
export type ProgramDegree = (typeof programDegreeEnum.enumValues)[number];

export const studentStatusEnum = pgEnum("student_status", [
    "ACTIVE",
    "SUSPENDED",
    "DROPPED",
    "GRADUATED",
]);
export type StudentStatus = (typeof studentStatusEnum.enumValues)[number];

export const instructorStatusEnum = pgEnum("instructor_status", [
    "ACTIVE",
    "ON_LEAVE",
    "RESIGNED",
    "RETIRED",
]);
export type InstructorStatus = (typeof instructorStatusEnum.enumValues)[number];

export const courseTypeEnum = pgEnum("course_type", [
    "COMPOSITE",
    "THEORY",
    "LAB",
    "PROJECT",
    "SEMINAR",
]);
export type CourseType = (typeof courseTypeEnum.enumValues)[number];

export const semesterEnum = pgEnum("semester_code", ["ODD", "SUMMER", "EVEN"]);
export type Semester = (typeof semesterEnum.enumValues)[number];

export const courseStatusEnum = pgEnum("offering_status", [
    "PROPOSED",
    "REJECTED",
    "ACCEPTED",
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

export const enrollmentTypeEnum = pgEnum("enrollment_type", [
    "CREDIT",
    "MINOR",
    "CONCENTRATION",
]);
export type EnrollmentType = (typeof enrollmentTypeEnum.enumValues)[number];

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
    "FINAL",
]);
export type AssesmentType = (typeof assessmentTypeEnum.enumValues)[number];

export const classroomTypeEnum = pgEnum("classroom_type", [
    "LECTURE",
    "LAB",
    "SEMINAR",
]);
export type ClassroomType = (typeof classroomTypeEnum.enumName)[number];

export const semesterStatusEnum = pgEnum("semester_status", [
    "UPCOMING",
    "ONGOING",
    "COMPLETED",
]);
export type SemesterStatus = (typeof semesterStatusEnum.enumValues)[number];

export const documentTypeEnum = pgEnum("semester_status", [
    "PROFILE_IMAGE",
    "FEES_DOCUMENT",
]);
export type DocumentType = (typeof documentTypeEnum.enumValues)[number];
