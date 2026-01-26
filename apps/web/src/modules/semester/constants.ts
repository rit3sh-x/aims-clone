export const SEMESTER_STATUS = ["UPCOMING", "ONGOING", "COMPLETED"] as const;

export const SEMESTER_TYPE = ["ODD", "SUMMER", "EVEN"] as const;

export type SemesterStatus = (typeof SEMESTER_STATUS)[number];
export type SemesterType = (typeof SEMESTER_TYPE)[number];
