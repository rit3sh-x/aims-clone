import { RouterOutputs } from "@workspace/api";

export type Student =
    RouterOutputs["hod"]["student"]["list"]["students"][number];
