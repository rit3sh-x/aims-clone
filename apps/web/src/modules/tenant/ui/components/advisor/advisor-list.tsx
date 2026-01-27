"use client";

import { useSuspenseAdvisors } from "../../../hooks/use-advisor";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { AdvisorCard } from "./advisor-card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const AdvisorList = () => {
    const { advisors, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useSuspenseAdvisors();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {advisors.map((advisor) => (
                    <AdvisorCard
                        key={advisor.advisor.id}
                        advisorData={advisor}
                    />
                ))}
            </div>

            <InfiniteScrollTrigger
                canLoadMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                noMoreText="No more advisors to load"
            />
        </div>
    );
};

export const AdvisorListSkeleton = () => {
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
