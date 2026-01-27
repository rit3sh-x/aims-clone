import { Suspense } from "react";
import {
    StudentActionsCard,
    StudentActionsCardSkeleton,
} from "../components/student/student-actions-card";
import {
    StudentSessions,
    StudentSessionsSkeleton,
} from "../components/student/student-sessions";

interface StudentIdViewProps {
    userId: string;
    studentId: string;
}

export const StudentIdView = ({ userId, studentId }: StudentIdViewProps) => {
    return (
        <div className="px-4 lg:px-12 py-8 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col w-full max-w-7xl mx-auto gap-y-6 h-full">
                <div className="flex-1">
                    <Suspense fallback={<StudentActionsCardSkeleton />}>
                        <StudentActionsCard id={studentId} />
                    </Suspense>
                </div>

                <div className="flex-1">
                    <Suspense fallback={<StudentSessionsSkeleton />}>
                        <StudentSessions userId={userId} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};
