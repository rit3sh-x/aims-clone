"use client";

import { useSuspenseDepartments } from "../../hooks/use-departments";
import { DepartmentCard } from "./department-card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const DepartmentsList = () => {
    const { data: departments } = useSuspenseDepartments();

    return (
        <div className="space-y-4">
            {departments.map((department) => (
                <DepartmentCard key={department.id} department={department} />
            ))}
        </div>
    );
};

export const DepartmentsListSkeleton = () => {
    return (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-10" />
                    </div>
                    <Skeleton className="h-3 w-1/2 mt-2" />
                </div>
            ))}
        </div>
    );
};
