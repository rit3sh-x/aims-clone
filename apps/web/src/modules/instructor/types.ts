import { RouterOutputs } from "@workspace/api";

export type Instructor =
    RouterOutputs["hod"]["instructor"]["list"]["items"][number];
