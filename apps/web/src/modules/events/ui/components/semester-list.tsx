"use client";

import { Suspense } from "react";
import { useStudentRecord } from "../../hooks/use-student-record";
import { SemesterCard } from "./semester-card";
import { Card } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

const SemesterListSkeleton = () => {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                    <div className="flex justify-between items-center mb-4">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </Card>
            ))}
        </div>
    );
};

export const SemesterList = () => {
    const { data: studentRecord } = useStudentRecord();

    return (
        <div className="space-y-6">
            <Suspense fallback={<SemesterListSkeleton />}>
                {studentRecord.map((semester) => (
                    <SemesterCard key={semester.semester.id} data={semester} />
                ))}
            </Suspense>
        </div>
    );
};
