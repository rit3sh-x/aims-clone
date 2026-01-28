import { Suspense } from "react";
import { WeeklySchedule } from "../components/weekly-schedule";
import { Card } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

const ScheduleSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-8 w-64" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                <Skeleton className="h-6 w-full max-w-md" />
            </div>

            <Card className="overflow-auto">
                <div className="min-w-[800px] p-4">
                    <Skeleton className="h-96 w-full" />
                </div>
            </Card>

            <Card className="p-4">
                <Skeleton className="h-32 w-full" />
            </Card>
        </div>
    );
};

export const ScheduleView = () => {
    return (
        <div className="w-full h-full flex flex-col flex-1 p-4">
            <Suspense fallback={<ScheduleSkeleton />}>
                <WeeklySchedule />
            </Suspense>
        </div>
    );
};
