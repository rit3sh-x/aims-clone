export const ENROLLMENT_STATUS = [
    "PENDING",
    "INSTRUCTOR_APPROVED",
    "INSTRUCTOR_REJECTED",
    "ADVISOR_REJECTED",
    "ENROLLED",
    "DROPPED",
    "COMPLETED",
] as const;
export type EnrollmentStatus = (typeof ENROLLMENT_STATUS)[number];
