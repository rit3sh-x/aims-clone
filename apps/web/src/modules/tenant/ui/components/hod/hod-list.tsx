"use client";

import { useSuspenseHods } from "../../../hooks/use-hod";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { HODCard } from "./hod-card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const HODList = () => {
    const { hods, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useSuspenseHods();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hods.map((hod) => (
                    <HODCard key={hod.hod.id} hodData={hod} />
                ))}
            </div>

            <InfiniteScrollTrigger
                canLoadMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                noMoreText="No more HODs to load"
            />
        </div>
    );
};
export const HODListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="p-4 border rounded-md shadow-sm">
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-10 mb-2" />
                    <Skeleton className="h-3 w-1/2 mt-2" />
                </div>
            ))}
        </div>
    );
};
