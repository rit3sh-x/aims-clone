import { Suspense } from "react";
import {
    HODActionsCard,
    HODActionsCardSkeleton,
} from "../components/hod/hod-actions-card";
import {
    HODSessions,
    HODSessionsSkeleton,
} from "../components/hod/hod-sessions";

interface HODIdViewProps {
    userId: string;
    hodId: string;
}

export const HODIdView = ({ userId, hodId }: HODIdViewProps) => {
    return (
        <div className="px-4 lg:px-12 py-8 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col w-full max-w-7xl mx-auto gap-y-6 h-full">
                <div className="flex-1">
                    <Suspense fallback={<HODActionsCardSkeleton />}>
                        <HODActionsCard id={hodId} />
                    </Suspense>
                </div>

                <div className="flex-1">
                    <Suspense fallback={<HODSessionsSkeleton />}>
                        <HODSessions userId={userId} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};
