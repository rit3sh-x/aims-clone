"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { format } from "date-fns";
import type { Offering } from "@/modules/courses/types";
import { humanizeEnum } from "@/lib/formatters";

interface OfferingCardProps {
    offering: Offering;
}

export const OfferingsCard = ({ offering }: OfferingCardProps) => {
    const { status, createdAt } = offering.offering;
    const { name: departmentName, code: departmentCode } = offering.department;
    const {
        year,
        semester,
        startDate,
        endDate,
        status: semesterStatus,
    } = offering.semester;

    return (
        <Card className="p-4 space-y-2 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                    {departmentName} ({departmentCode})
                </h3>
                <Badge variant="outline" className="text-[10px] uppercase">
                    {humanizeEnum(status)}
                </Badge>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
                <div>
                    <span className="font-medium text-foreground">
                        Semester:
                    </span>{" "}
                    {humanizeEnum(semester)} {year} (
                    {humanizeEnum(semesterStatus)})
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Start Date:
                    </span>{" "}
                    {format(new Date(startDate), "dd MMM yyyy")}
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        End Date:
                    </span>{" "}
                    {format(new Date(endDate), "dd MMM yyyy")}
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Created At:
                    </span>{" "}
                    {format(new Date(createdAt), "dd MMM yyyy")}
                </div>
            </div>
        </Card>
    );
};
