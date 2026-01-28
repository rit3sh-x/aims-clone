import { Suspense } from "react";
import { DepartmentFilters } from "../components/departments-filter";
import {
    DepartmentsList,
    DepartmentsListSkeleton,
} from "../components/department-list";

export const DepartmentsView = () => {
    return (
        <div className="w-full px-4 lg:px-12 py-8 flex flex-col gap-4 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12 h-full">
                <div className="lg:col-span-2 xl:col-span-2">
                    <div className="sticky top-0">
                        <DepartmentFilters />
                    </div>
                </div>

                <div className="lg:col-span-4 xl:col-span-6">
                    <Suspense fallback={<DepartmentsListSkeleton />}>
                        <DepartmentsList />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};
