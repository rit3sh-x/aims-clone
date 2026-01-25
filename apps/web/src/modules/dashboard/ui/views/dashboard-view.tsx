import { UserRole } from "@workspace/db";
import { SectionCards } from "../components/section-cards";
import { Suspense } from "react";
import { RecentLogs, RecentLogsSkeleton } from "../components/logs";
import { ChartInteractiveArea } from "../components/chart-interactive-area";

interface DashboardViewProps {
    role: UserRole;
}

export const DashboardView = ({ role }: DashboardViewProps) => {
    return (
        <div className="flex items-center justify-center bg-background w-full h-full gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards role={role} />
            <div className="px-4 lg:px-6">
                <ChartInteractiveArea role={role} />
            </div>
            {role === "ADMIN" && (
                <Suspense fallback={<RecentLogsSkeleton />}>
                    <RecentLogs />
                </Suspense>
            )}
        </div>
    );
};
