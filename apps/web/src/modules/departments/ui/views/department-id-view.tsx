import { Suspense } from "react";
import {
    DepartmentDetail,
    DepartmentDetailSkeleton,
} from "../components/department-detail";
import {
    DepartmentFacultyList,
    DepartmentFacultyListSkeleton,
} from "../components/faculty-list";
import { DepartmentFacultySearch } from "../components/department-faculty-search";

interface DepartmentIdViewProps {
    departmentId: string;
}

export const DepartmentIdView = ({ departmentId }: DepartmentIdViewProps) => {
    return (
        <div className="w-full h-[calc(100vh-4rem)] overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-y-6 px-4 py-6 h-full overflow-y-auto">
                <Suspense fallback={<DepartmentDetailSkeleton />}>
                    <DepartmentDetail departmentId={departmentId} />
                </Suspense>
                <div className="sticky top-0 z-10 bg-background pt-2 pb-3">
                    <DepartmentFacultySearch />
                </div>
                <Suspense fallback={<DepartmentFacultyListSkeleton />}>
                    <DepartmentFacultyList departmentId={departmentId} />
                </Suspense>
            </div>
        </div>
    );
};
