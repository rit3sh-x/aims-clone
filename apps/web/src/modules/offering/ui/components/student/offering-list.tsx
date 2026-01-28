"use client";

import { useSuspenseOfferingList } from "../../../hooks/use-student-offering";
import { OfferingCard } from "./offering-card";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const OfferingList = () => {
    const { offerings, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useSuspenseOfferingList();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {offerings.map((offering) => (
                    <OfferingCard
                        key={offering.offering.id}
                        offering={offering}
                    />
                ))}
            </div>

            <InfiniteScrollTrigger
                canLoadMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                noMoreText="No more offerings to load"
            />
        </div>
    );
};

export const OfferingListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                    key={index}
                    className="p-4 border rounded-md shadow-sm"
                >
                    <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                </Skeleton>
            ))}
        </div>
    );
};
