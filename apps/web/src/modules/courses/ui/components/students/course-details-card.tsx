"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { humanizeEnum } from "@/lib/formatters";
import { useSuspenseCourse } from "@/modules/courses/hooks/use-student-course";
import { RichText } from "@/components/rich-text";

interface CourseDetailsCardProps {
    courseId: string;
}

export const CourseDetailsCard = ({ courseId }: CourseDetailsCardProps) => {
    const { data } = useSuspenseCourse(courseId);
    const { course, department } = data;

    const statusColors: Record<string, string> = {
        PROPOSED: "bg-yellow-100 text-yellow-800",
        HOD_ACCEPTED: "bg-blue-100 text-blue-800",
        ADMIN_ACCEPTED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
    };

    return (
        <Card className="p-6 space-y-6 w-full h-full overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">{course.code}</h1>
                    <p className="text-muted-foreground">{course.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {department.name}
                    </p>
                </div>

                <Badge
                    variant="outline"
                    className={cn(
                        "text-xs uppercase",
                        statusColors[course.status]
                    )}
                >
                    {humanizeEnum(course.status)}
                </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Info label="Credits" value={course.credits} />
                <Info label="Lecture Hours" value={course.lectureHours} />
                <Info label="Tutorial Hours" value={course.tutorialHours} />
                <Info label="Practical Hours" value={course.practicalHours} />
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold text-sm">Description</h3>
                <RichText content={course.description} disabled={true} />
            </div>
        </Card>
    );
};

const Info = ({ label, value }: { label: string; value: string | number }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
    </div>
);

export const CourseDetailsCardSkeleton = () => {
    return (
        <Card className="p-6 space-y-6 h-full">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-6 w-24" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-5 w-12" />
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-20 w-full" />
            </div>
        </Card>
    );
};
