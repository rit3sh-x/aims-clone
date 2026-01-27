export const CLASSROOMS = ["LECTURE" , "LAB" , "TUTORIAL" , "SEMINAR"] as const;
export type ClassroomType = (typeof CLASSROOMS)[number];