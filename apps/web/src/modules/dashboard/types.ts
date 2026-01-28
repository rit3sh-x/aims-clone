import { RouterOutputs } from "@workspace/api";

export type MetricLogs =
    RouterOutputs["admin"]["metrics"]["recentLogs"][number];
export type SpotlightOutput = RouterOutputs["spotlight"]["spotlightSearch"];
