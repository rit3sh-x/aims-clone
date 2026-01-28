"use client";

import { Suspense } from "react";
import { SemesterList } from "../components/semester-list";
import { SemesterListSkeleton } from "@/modules/semester/ui/components/semester-list";

export const StudentRecordView = () => {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Student Record</h1>
            <p className="text-muted-foreground">
                View your academic performance and semester details below.
            </p>
            <Suspense fallback={<SemesterListSkeleton />}>
                <SemesterList />
            </Suspense>
        </div>
    );
};
