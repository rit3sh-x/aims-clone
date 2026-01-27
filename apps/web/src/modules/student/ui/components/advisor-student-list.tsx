"use client";

import { useInfiniteAdvisorStudents } from "../../hooks/use-students";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { StudentCard } from "./student-card";

export const AdvisorStudentList = () => {
    const { students, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteAdvisorStudents();

    return (
        <div className="space-y-4">
            {students.map((student) => (
                <StudentCard key={student.student.id} studentData={student} />
            ))}

            <InfiniteScrollTrigger
                canLoadMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                noMoreText="No more students to load"
            />
        </div>
    );
};

export const AdvisorStudentListSkeleton = () => {
    return (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="p-4 border rounded-md shadow-sm bg-gray-100 animate-pulse"
                >
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mt-2"></div>
                </div>
            ))}
        </div>
    );
};
