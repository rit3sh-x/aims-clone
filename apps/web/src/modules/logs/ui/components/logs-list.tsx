"use client";

import { useInfiniteLogs } from "../../hooks/use-logs";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { cn } from "@workspace/ui/lib/utils";
import { LogCard } from "./log-card";

export const LogsList = () => {
    const { logs, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteLogs();

    return (
        <div className="space-y-4">
            {logs.map((log) => (
                <LogCard key={log.id} log={log} />
            ))}

            <InfiniteScrollTrigger
                canLoadMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                noMoreText="No more logs to load"
            />
        </div>
    );
};

export const LogsListSkeleton = () => {
    return (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        "p-4 border rounded-md shadow-sm bg-gray-100 animate-pulse"
                    )}
                >
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>
            ))}
        </div>
    );
};
