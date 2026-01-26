import { useTRPC } from "@/trpc/client";
import { useLogsParams } from "./use-logs-params";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteLogs = () => {
    const [{ action, dateFrom, dateTo, entity }] = useLogsParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.admin.logs.list.infiniteQueryOptions(
            {
                action: action === "" ? undefined : action,
                entityType: entity === "" ? undefined : entity,
                dateFrom: dateFrom ?? undefined,
                dateTo: dateTo ?? undefined,
            },
            {
                getNextPageParam: (lastPage) =>
                    lastPage.nextCursor ?? undefined,
                getPreviousPageParam: () => undefined,
            }
        )
    );

    const logs = query.data.pages.flatMap((page) => page.logs);

    return {
        logs,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
};
