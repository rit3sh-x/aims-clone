import { RouterOutputs } from "@workspace/api";

export type Enrollment =
    RouterOutputs["advisor"]["enrollment"]["list"]["items"][number];
