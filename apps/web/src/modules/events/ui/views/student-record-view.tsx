"use client";

import { Suspense } from "react";
import {
    SemesterList,
    SemesterListSkeleton,
} from "../components/semester-list";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

export const StudentRecordView = () => {
    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto">
            <div className="p-6 pb-0 space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">
                    Student Record
                </h1>
                <p className="text-muted-foreground">
                    View your academic performance and semester details below.
                </p>
            </div>
            <ScrollArea className="flex-1 px-6 py-4">
                <Suspense fallback={<SemesterListSkeleton />}>
                    <SemesterList />
                </Suspense>
            </ScrollArea>
        </div>
    );
};
