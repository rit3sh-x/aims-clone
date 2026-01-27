import { Suspense } from "react";
import {
    AdvisorActionsCard,
    AdvisorActionsCardSkeleton,
} from "../components/advisor/advisor-actions-card";
import {
    AdvisorSessions,
    AdvisorSessionsSkeleton,
} from "../components/advisor/advisor-sessions";

interface AdvisorIdViewProps {
    userId: string;
    advisorId: string;
}

export const AdvisorIdView = ({ userId, advisorId }: AdvisorIdViewProps) => {
    return (
        <div className="px-4 lg:px-12 py-8 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col w-full max-w-7xl mx-auto gap-y-6 h-full">
                <div className="flex-1">
                    <Suspense fallback={<AdvisorActionsCardSkeleton />}>
                        <AdvisorActionsCard id={advisorId} />
                    </Suspense>
                </div>

                <div className="flex-1">
                    <Suspense fallback={<AdvisorSessionsSkeleton />}>
                        <AdvisorSessions userId={userId} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};
