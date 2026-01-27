"use client";

import { useSuspenseStudents } from "../../../hooks/use-student";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { StudentCard } from "./student-card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const StudentList = () => {
    const { students, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useSuspenseStudents();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                    <StudentCard
                        key={student.student.id}
                        studentData={student}
                    />
                ))}
            </div>

            <InfiniteScrollTrigger
                canLoadMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                noMoreText="No more students to load"
            />
        </div>
    );
};

export const StudentListSkeleton = () => {
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
