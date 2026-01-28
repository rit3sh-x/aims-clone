import { RouterOutputs } from "@workspace/api";

export type Offering =
    RouterOutputs["hod"]["offering"]["list"]["items"][number];
