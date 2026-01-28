import { Suspense } from "react";
import { CourseFilter } from "../components/instructor/course-filter";
import {
    CoursesList,
    CoursesListSkeleton,
} from "../components/instructor/courses-list";
import { ProposeCourseForm } from "../components/instructor/propose-course-form";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const InstructorCourseView = () => {
    return (
        <div className="w-full px-4 lg:px-12 py-8 flex flex-col gap-4 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Courses</h1>
                <ProposeCourseForm />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12 h-full">
                <div className="lg:col-span-2 xl:col-span-2">
                    <div className="sticky top-4">
                        <CourseFilter />
                    </div>
                </div>
                <div className="lg:col-span-4 xl:col-span-6">
                    <Suspense fallback={<CoursesListSkeleton />}>
                        <CoursesList />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export const InstructorCourseViewSkeleton = () => {
    return (
        <div className="w-full px-4 lg:px-12 py-8 flex flex-col gap-4 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-36" />
            </div>

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
                    <CoursesListSkeleton />
                </div>
            </div>
        </div>
    );
};
