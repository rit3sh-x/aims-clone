"use client";

import { Globe, GraduationCap } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useSuspenseDepartment } from "../../hooks/use-departments";

interface DepartmentDetailProps {
    departmentId: string;
}

export const DepartmentDetail = ({ departmentId }: DepartmentDetailProps) => {
    const { data: department } = useSuspenseDepartment(departmentId);

    return (
        <Card className="p-6 space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold">{department.name}</h2>
                    <Badge variant="outline" className="uppercase">
                        {department.code}
                    </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <a
                        href={department.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        {department.website}
                    </a>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium text-sm">
                        Programs ({department.programs.length})
                    </h3>
                </div>

                {department.programs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No programs associated with this department.
                    </p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {department.programs.map((program) => (
                            <Badge
                                key={program.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                <span className="font-medium">
                                    {program.code}
                                </span>
                                <span className="text-muted-foreground">
                                    {program.name}
                                </span>
                                <Badge
                                    variant="outline"
                                    className="ml-1 text-[10px]"
                                >
                                    {program.degreeType}
                                </Badge>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};

export const DepartmentDetailSkeleton = () => {
    return (
        <Card className="p-6 space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-5 w-12" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-56" />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-36 rounded-full" />
                    ))}
                </div>
            </div>
        </Card>
    );
};
