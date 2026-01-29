"use client";

import { useRouter } from "next/navigation";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { humanizeEnum } from "@/lib/formatters";
import type { Course } from "@/modules/courses/types";
import type { Route } from "next";

interface CourseCardProps {
    course: Course;
    disabled?: boolean;
}

export const CourseCard = ({ course, disabled = false }: CourseCardProps) => {
    const router = useRouter();

    const goToCourse = () => {
        if (!disabled) {
            router.push(`/courses/${course.id}` as Route);
        }
    };

    const statusColors: Record<string, string> = {
        PROPOSED: "bg-yellow-100 text-yellow-800",
        HOD_ACCEPTED: "bg-blue-100 text-blue-800",
        ADMIN_ACCEPTED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
    };

    return (
        <Card
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={goToCourse}
            onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToCourse();
                }
            }}
            className={cn(
                "p-4 space-y-2 transition",
                disabled
                    ? "opacity-60 pointer-events-none"
                    : "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h3 className="font-semibold text-sm">{course.code}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {course.title}
                    </p>
                </div>

                <Badge
                    variant="outline"
                    className={cn(
                        "text-[10px] uppercase",
                        statusColors[course.status]
                    )}
                >
                    {humanizeEnum(course.status)}
                </Badge>
            </div>

            <div className="text-xs text-muted-foreground flex gap-4">
                <span>Credits: {course.credits}</span>
                <span>
                    L-T-P: {course.lectureHours}-{course.tutorialHours}-
                    {course.practicalHours}
                </span>
            </div>
        </Card>
    );
};
