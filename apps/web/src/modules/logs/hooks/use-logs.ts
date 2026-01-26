import { useTRPC } from "@/trpc/client";
import { useLogsParams } from "./use-logs-params";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteLogs = () => {
    const [{ action, dateFrom, dateTo, entity }] = useLogsParams();
    const trpc = useTRPC();

    const query = useInfiniteQuery(
        trpc.admin.logs.list.infiniteQueryOptions(
            {
                action: action === "" ? undefined : action,
                entityType: entity === "" ? undefined : entity,
                dateFrom: dateFrom ?? undefined,
                dateTo: dateTo ?? undefined,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
                getPreviousPageParam: () => undefined,
                placeholderData: (previousData) => previousData,
            }
        )
    );

    const logs = query.data?.pages.flatMap((page) => page.logs) ?? [];
    const hasNextPage = query.hasNextPage;

    return {
        ...query,
        logs,
        hasNextPage,
        isEmpty: !query.isLoading && logs.length === 0,
    };
};
