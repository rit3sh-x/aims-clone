import { RouterOutputs } from "@workspace/api";
export type {
    LabPeriod,
    SessionType,
    AttendanceType,
    TheoryPeriod,
    TutorialPeriod,
    AttendanceStatus,
    DaysOfWeek,
} from "@workspace/db";

export type SemesterCardType =
    RouterOutputs["student"]["self"]["performance"][number];
