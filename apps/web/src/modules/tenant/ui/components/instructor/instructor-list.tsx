"use client";

import { useSuspenseInstructors } from "../../../hooks/use-instructor";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { InstructorCard } from "./instructor-card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const InstructorList = () => {
    const { instructors, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useSuspenseInstructors();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {instructors.map((instructor) => (
                    <InstructorCard
                        key={instructor.instructor.id}
                        instructorData={instructor}
                    />
                ))}
            </div>

            <InfiniteScrollTrigger
                canLoadMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                noMoreText="No more instructors to load"
            />
        </div>
    );
};

export const InstructorListSkeleton = () => {
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
