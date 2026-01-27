"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { formatDistanceToNow } from "date-fns";
import type { Student } from "../../types";

interface StudentCardProps {
    studentData: Student;
}

export const StudentCard = ({ studentData }: StudentCardProps) => {
    const { student, user, batch, program, department } = studentData;

    return (
        <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg">
                        {user.name} ({student.rollNo})
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Joined{" "}
                        {formatDistanceToNow(new Date(student.createdAt), {
                            addSuffix: true,
                        })}
                    </p>
                </div>
                <Badge variant={user.disabled ? "destructive" : "outline"}>
                    {user.disabled ? "Disabled" : "Active"}
                </Badge>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
                <div>
                    <span className="font-medium text-foreground">Email:</span>{" "}
                    {user.email}
                </div>
                <div>
                    <span className="font-medium text-foreground">Role:</span>{" "}
                    {user.role}
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Batch Year:
                    </span>{" "}
                    {batch.year}
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Program:
                    </span>{" "}
                    {program.name}
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Department:
                    </span>{" "}
                    {department.name}
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Updated At:
                    </span>{" "}
                    {new Date(student.updatedAt).toLocaleString()}
                </div>
            </div>
        </Card>
    );
};
