"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { useRouter } from "next/navigation";
import type { Instructor } from "@/modules/tenant/types";

export const InstructorCard = ({
    instructorData,
}: {
    instructorData: Instructor;
}) => {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/instructor/${instructorData.instructor.id}`);
    };

    return (
        <Card
            className="p-4 space-y-2 cursor-pointer hover:shadow-lg"
            onClick={handleCardClick}
        >
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                    {instructorData.user.name}
                </h3>

                <Badge variant="outline" className="text-[10px] uppercase">
                    {instructorData.department.name}
                </Badge>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
                <div>
                    <span className="font-medium text-foreground">Email:</span>{" "}
                    {instructorData.user.email}
                </div>

                <div>
                    <span className="font-medium text-foreground">Phone:</span>{" "}
                    {instructorData.instructor.phoneNumber ?? "—"}
                </div>
            </div>
        </Card>
    );
};
