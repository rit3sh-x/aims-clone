export const COURSE_STATUS = [
    "PROPOSED",
    "REJECTED",
    "HOD_ACCEPTED",
    "ADMIN_ACCEPTED",
] as const;
export type CourseStatus = (typeof COURSE_STATUS)[number];
