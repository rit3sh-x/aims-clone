"use client";

import { MoreVertical, Plus, X } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { humanizeEnum } from "@/lib/formatters";
import {
    useSuspenseOffering,
    useDropOffering,
    useEnrollOffering,
} from "@/modules/offering/hooks/use-student-offering";
import { RichText } from "@/components/rich-text";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface OfferingDetailsCardProps {
    offeringId: string;
}

export const OfferingDetailsCard = ({
    offeringId,
}: OfferingDetailsCardProps) => {
    const { data } = useSuspenseOffering(offeringId);
    const { offering, course, department } = data;

    const enrollOffering = useEnrollOffering();
    const dropOffering = useDropOffering();

    const showActions = offering.status === "ENROLLING";

    return (
        <Card className="p-6 space-y-6 w-full h-full overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold">
                        {course.code} — {course.title}
                    </h2>

                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="uppercase text-[10px]"
                        >
                            {humanizeEnum(offering.status)}
                        </Badge>

                        <Badge variant="secondary" className="text-[10px]">
                            {department.code}
                        </Badge>
                    </div>
                </div>

                {showActions && (
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={(props) => (
                                <Button variant="ghost" size="icon" {...props}>
                                    <MoreVertical className="size-4" />
                                </Button>
                            )}
                        />

                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                                onClick={() =>
                                    enrollOffering.mutate({
                                        offeringId: offering.id,
                                    })
                                }
                                disabled={enrollOffering.isPending}
                            >
                                <Plus className="mr-2 size-4" />
                                Enroll
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() =>
                                    dropOffering.mutate({
                                        offeringId: offering.id,
                                    })
                                }
                                disabled={dropOffering.isPending}
                                className="text-destructive focus:text-destructive"
                            >
                                <X className="mr-2 size-4" />
                                Drop
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <Info label="Credits" value={course.credits} />
                <Info label="Lecture Hours" value={course.lectureHours} />
                <Info label="Tutorial Hours" value={course.tutorialHours} />
                <Info label="Practical Hours" value={course.practicalHours} />
                <Info label="Self Study Hours" value={course.selfStudyHours} />
                <Info label="Department" value={department.name} />
                <Info label="Semester Year" value={data.semester.year} />
                <Info
                    label="Enrollment Deadline"
                    value={new Date(
                        data.semester.enrollmentDeadline
                    ).toLocaleDateString()}
                />
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium">Course Description</h3>
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

export const OfferingDetailsCardSkeleton = () => {
    return (
        <Card className="p-6 space-y-6 h-full">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-64" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-20 rounded-full" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                </div>

                <Button variant="ghost" size="icon" disabled>
                    <MoreVertical className="size-4 opacity-40" />
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                    ))}
                </div>
            </div>
        </Card>
    );
};
