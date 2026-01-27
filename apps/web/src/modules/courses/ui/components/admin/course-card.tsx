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
                    <h3 className="font-semibold text-sm">
                        {course.code}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {course.title}
                    </p>
                </div>

                <Badge variant="outline" className="text-[10px] uppercase">
                    {humanizeEnum(course.status)}
                </Badge>
            </div>

            <div className="text-xs text-muted-foreground flex gap-4">
                <span>Credits: {course.credits}</span>
                <span>
                    L-T-P: {course.lectureHours}-
                    {course.tutorialHours}-
                    {course.practicalHours}
                </span>
            </div>
        </Card>
    );
};
