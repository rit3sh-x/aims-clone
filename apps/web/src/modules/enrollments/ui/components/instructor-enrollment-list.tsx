"use client";

import {
    useInfiniteInstructorEnrollments,
    useInstructorApproveEnrollment,
    useInstructorRejectEnrollment,
} from "../../hooks/use-enrollments";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { EnrollmentCard } from "./enrollment-card";
import type { UserRole } from "@workspace/db";

interface InstructorEnrollmentListProps {
    role: UserRole;
}

export const InstructorEnrollmentList = ({
    role,
}: InstructorEnrollmentListProps) => {
    const { enrollments, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteInstructorEnrollments();
    const approveEnrollment = useInstructorApproveEnrollment();
    const rejectEnrollment = useInstructorRejectEnrollment();

    const handleAccept = (enrollmentId: string) => {
        approveEnrollment.mutate({
            enrollmentId,
        });
    };

    const handleReject = (enrollmentId: string) => {
        rejectEnrollment.mutate({
            enrollmentId,
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {enrollments.map((enrollment) => (
                    <EnrollmentCard
                        key={enrollment.enrollment.id}
                        enrollment={enrollment}
                        onAccept={handleAccept}
                        onReject={handleReject}
                        role={role}
                    />
                ))}
            </div>

            <InfiniteScrollTrigger
                canLoadMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                noMoreText="No more enrollments to load"
            />
        </div>
    );
};

export const InstructorEnrollmentListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="p-4 border rounded-md shadow-sm bg-gray-100 animate-pulse"
                >
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mt-2"></div>
                    <div className="flex gap-2 mt-4">
                        <div className="h-8 w-20 bg-gray-300 rounded"></div>
                        <div className="h-8 w-20 bg-gray-300 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
