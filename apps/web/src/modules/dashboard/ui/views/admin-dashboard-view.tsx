import type { UserRole } from "@workspace/db";
import { SectionCards } from "../components/section-cards";
import { Suspense } from "react";
import { RecentLogs, RecentLogsSkeleton } from "../components/logs";
import { ChartInteractiveArea } from "../components/chart-interactive-area";

interface AdminDashboardViewProps {
    role: UserRole;
}

export const AdminDashboardView = ({ role }: AdminDashboardViewProps) => {
    return (
        <div className="flex flex-col bg-background w-full h-[calc(100vh-4rem)] gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6 overflow-y-auto">
            <SectionCards role={role} />
            <div className="w-full">
                <ChartInteractiveArea role={role} />
            </div>
            <Suspense fallback={<RecentLogsSkeleton />}>
                <RecentLogs />
            </Suspense>
        </div>
    );
};
