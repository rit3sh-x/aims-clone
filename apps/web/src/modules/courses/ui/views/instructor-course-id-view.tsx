import { Suspense } from "react";
import {
    CourseDetailsCard,
    CourseDetailsCardSkeleton,
} from "../components/instructor/course-details-card";

interface InstructorCourseIdViewProps {
    courseId: string;
}

export const InstructorCourseIdView = ({
    courseId,
}: InstructorCourseIdViewProps) => {
    return (
        <div className="px-4 lg:px-12 py-8 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col w-full max-w-4xl mx-auto gap-y-6 h-full">
                <Suspense fallback={<CourseDetailsCardSkeleton />}>
                    <CourseDetailsCard courseId={courseId} />
                </Suspense>
            </div>
        </div>
    );
};
