"use client";

import { useSuspenseClassrooms } from "../../hooks/use-classrooms";
import { ClassroomCard } from "./classroom-card";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const ClassroomList = () => {
    const { classroom, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useSuspenseClassrooms();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {classroom.map((classroom) => (
                    <ClassroomCard key={classroom.id} classroom={classroom} />
                ))}
            </div>

            <InfiniteScrollTrigger
                canLoadMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                noMoreText="No more classrooms to load"
            />
        </div>
    );
};

export const ClassroomListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-10" />
                    </div>
                    <Skeleton className="h-3 w-1/2 mt-2" />
                </div>
            ))}
        </div>
    );
};
