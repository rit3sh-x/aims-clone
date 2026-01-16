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
]);
export type AuditAction = (typeof auditActionEnum.enumValues)[number];

export const auditEntityEnum = pgEnum("audit_entity", [
    "USER",
    "STUDENT",
    "INSTRUCTOR",
    "COURSE",
    "COURSE_OFFERING",
    "ENROLLMENT",
    "ATTENDANCE",
    "GRADE",
    "ANNOUNCEMENT",
    "DOCUMENT",
    "SESSION",
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
    "CSB",
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
    "THEORY",
    "LAB",
    "PROJECT",
    "SEMINAR",
]);
export type CourseType = (typeof courseTypeEnum.enumValues)[number];

export const semesterEnum = pgEnum("semester", ["SPRING", "SUMMER", "FALL"]);
export type Semester = (typeof semesterEnum.enumValues)[number];

export const offeringStatusEnum = pgEnum("offering_status", [
    "PROPOSED",
    "ENROLLING",
    "REJECTED",
    "CLOSED",
]);
export type OfferingStatus = (typeof offeringStatusEnum.enumValues)[number];

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
    "PENDING",
    "INSTRUCTOR_APPROVED",
    "ADVISOR_APPROVED",
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