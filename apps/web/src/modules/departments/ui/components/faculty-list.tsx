"use client";

import { useSuspenseListDepartmentFaculty } from "../../hooks/use-departments";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { FacultyCard } from "./faculty-card";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface DepartmentFacultyListProps {
    departmentId: string;
}

export const DepartmentFacultyList = ({
    departmentId,
}: DepartmentFacultyListProps) => {
    const { faculty, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useSuspenseListDepartmentFaculty(departmentId);

    return (
        <div className="space-y-4">
            {faculty.map((item) => (
                <FacultyCard key={item.instructor.id} faculty={item} />
            ))}

            <InfiniteScrollTrigger
                canLoadMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                noMoreText="No more faculty to load"
            />
        </div>
    );
};

export const DepartmentFacultyListSkeleton = () => {
    return (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="p-4 border border-border rounded-md"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            ))}
        </div>
    );
};
