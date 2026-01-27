"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { useRouter } from "next/navigation";
import type { Student } from "@/modules/tenant/types";

export const StudentCard = ({ studentData }: { studentData: Student }) => {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/student/${studentData.student.id}`);
    };

    return (
        <Card
            className="p-4 space-y-2 cursor-pointer hover:shadow-lg"
            onClick={handleCardClick}
        >
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                    {studentData.user.name}
                </h3>

                <Badge variant="outline" className="text-[10px] uppercase">
                    {studentData.department.name}
                </Badge>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
                <div>
                    <span className="font-medium text-foreground">Email:</span>{" "}
                    {studentData.user.email}
                </div>
            </div>
        </Card>
    );
};
