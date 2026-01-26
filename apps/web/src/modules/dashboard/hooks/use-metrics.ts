import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useMetricLogs = () => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.admin.metrics.recentLogs.queryOptions());
};

export const useMetricCards = () => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.admin.metrics.cardMetrics.queryOptions());
};

export const useMetricCharts = (days: number) => {
    const trpc = useTRPC();
    return useSuspenseQuery(
        trpc.admin.metrics.chartData.queryOptions({
            days,
        })
    );
};
