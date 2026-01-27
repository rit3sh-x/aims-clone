import { Suspense } from "react";
import {
    InstructorActionsCard,
    InstructorActionsCardSkeleton,
} from "../components/instructor/instructor-actions-card";
import {
    InstructorSessions,
    InstructorSessionsSkeleton,
} from "../components/instructor/instructor-sessions";

interface InstructorIdViewProps {
    userId: string;
    instructorId: string;
}

export const InstructorIdView = ({
    userId,
    instructorId,
}: InstructorIdViewProps) => {
    return (
        <div className="px-4 lg:px-12 py-8 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col w-full max-w-7xl mx-auto gap-y-6 h-full">
                <div className="flex-1">
                    <Suspense fallback={<InstructorActionsCardSkeleton />}>
                        <InstructorActionsCard id={instructorId} />
                    </Suspense>
                </div>

                <div className="flex-1">
                    <Suspense fallback={<InstructorSessionsSkeleton />}>
                        <InstructorSessions userId={userId} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};
