"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import type { Student } from "@/modules/tenant/types";
import type { Route } from "next";

export const StudentCard = ({ studentData }: { studentData: Student }) => {
    return (
        <Link href={`/student/${studentData.student.id}` as Route} passHref>
            <Card className="p-4 space-y-2 cursor-pointer hover:shadow-lg">
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
                        <span className="font-medium text-foreground">
                            Email:
                        </span>{" "}
                        {studentData.user.email}
                    </div>
                </div>
            </Card>
        </Link>
    );
};
