import { RouterOutputs } from "@workspace/api";

export type Hod = RouterOutputs["admin"]["hod"]["list"]["items"][number];
export type Advisor =
    RouterOutputs["admin"]["advisor"]["list"]["items"][number];
export type Instructor =
    RouterOutputs["admin"]["instructor"]["list"]["items"][number];
export type Student =
    RouterOutputs["admin"]["student"]["list"]["students"][number];
