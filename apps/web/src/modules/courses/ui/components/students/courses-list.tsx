"use client";

import { useSuspenseCoursesList } from "@/modules/courses/hooks/use-student-course";
import { CourseCard } from "./course-card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const CoursesList = () => {
    const { data: courses } = useSuspenseCoursesList();

    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No courses found</p>
                <p className="text-sm text-muted-foreground">
                    Try adjusting your search
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export const CoursesListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="p-4 border rounded-md shadow-sm space-y-2"
                >
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            ))}
        </div>
    );
};
