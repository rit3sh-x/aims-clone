"use client";

import { useSuspenseCourseOfferings } from "../../../hooks/use-courses";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { OfferingsCard } from "./offerings-card";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface OfferingsListProps {
    courseId: string;
}

export const OfferingsList = ({ courseId }: OfferingsListProps) => {
    const { offerings, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useSuspenseCourseOfferings(courseId);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {offerings.map((offering) => (
                    <OfferingsCard
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

export const OfferingsListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="p-4 border rounded-md shadow-sm">
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    );
};
