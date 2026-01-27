"use client";

import { useRouter } from "next/navigation";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

type FacultyItem = {
    instructor: {
        id: string;
        designation: string | null;
    };
    user: {
        name: string;
        email: string;
        role: "ADMIN" | "ADVISOR" | "HOD" | "INSTRUCTOR" | "STUDENT";
        disabled: boolean;
    };
};

export const FacultyCard = ({ faculty }: { faculty: FacultyItem }) => {
    const router = useRouter();

    const goToInstructor = () => {
        router.push(`/instructor/${faculty.instructor.id}`);
    };

    return (
        <Card
            role="button"
            tabIndex={0}
            onClick={goToInstructor}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToInstructor();
                }
            }}
            className="
                p-4 cursor-pointer transition
                hover:bg-muted/50
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
            "
        >
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">
                            {faculty.user.name}
                        </h3>
                        <Badge
                            variant="outline"
                            className="text-[10px] uppercase"
                        >
                            {faculty.user.role}
                        </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        {faculty.user.email}
                    </p>

                    {faculty.instructor.designation && (
                        <p className="text-xs">
                            {faculty.instructor.designation}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
};
