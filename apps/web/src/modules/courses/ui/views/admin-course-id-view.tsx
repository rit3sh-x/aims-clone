import { Suspense } from "react";
import {
    CourseDetailsCard,
    CourseDetailsCardSkeleton,
} from "../components/admin/course-details-card";
import {
    OfferingsList,
    OfferingsListSkeleton,
} from "../components/admin/offerings-list";

interface AdminCourseIdViewProps {
    courseId: string;
}

export const AdminCourseIdView = ({ courseId }: AdminCourseIdViewProps) => {
    return (
        <div className="px-4 lg:px-12 py-8 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col w-full max-w-7xl mx-auto gap-y-6 h-full">
                <div className="flex-1">
                    <Suspense fallback={<CourseDetailsCardSkeleton />}>
                        <CourseDetailsCard courseId={courseId} />
                    </Suspense>
                </div>

                <div className="flex-1">
                    <Suspense fallback={<OfferingsListSkeleton />}>
                        <OfferingsList courseId={courseId} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};
