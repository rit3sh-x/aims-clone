import { Suspense } from "react";
import { LogsFilters } from "../components/logs-filter";
import { LogsList, LogsListSkeleton } from "../components/logs-list";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const LogsView = () => {
    return (
        <div className="w-full px-4 lg:px-12 py-8 flex flex-col gap-4 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12 h-full">
                <div className="lg:col-span-2 xl:col-span-2">
                    <div className="sticky top-4">
                        <LogsFilters />
                    </div>
                </div>
                <div className="lg:col-span-4 xl:col-span-6">
                    <Suspense fallback={<LogsListSkeleton />}>
                        <LogsList />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export const LogsViewSkeleton = () => {
    return (
        <div className="w-full px-4 lg:px-12 py-8 flex flex-col gap-4 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12 h-full">
                <div className="lg:col-span-2 xl:col-span-2">
                    <div className="sticky top-4">
                        <div className="border rounded-md bg-card overflow-hidden">
                            <div className="p-4 border-b bg-muted/30">
                                <Skeleton className="h-4 w-1/3 mb-2" />
                            </div>
                            <div className="p-4 space-y-4">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-1/3" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 xl:col-span-6">
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="p-4 border rounded-md shadow-sm bg-muted animate-pulse"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-1/3" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-4 w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
