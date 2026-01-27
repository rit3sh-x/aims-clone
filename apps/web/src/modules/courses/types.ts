import { RouterOutputs } from "@workspace/api";

export type Course = RouterOutputs["admin"]["course"]["list"]["courses"][number]["course"];
export type CourseWithDepartment = RouterOutputs["admin"]["course"]["getOne"];
export type Offering = RouterOutputs["admin"]["offering"]["list"]["items"][number];