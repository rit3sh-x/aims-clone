"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { formatDistanceToNow } from "date-fns";
import type { Instructor } from "../../types";

interface InstructorCardProps {
    instructorData: Instructor;
}

export const InstructorCard = ({ instructorData }: InstructorCardProps) => {
    const { instructor, user, department } = instructorData;

    return (
        <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg">
                        {user.name} ({instructor.employeeId})
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Joined{" "}
                        {formatDistanceToNow(new Date(instructor.createdAt), {
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
                        Phone Number:
                    </span>{" "}
                    {instructor.phoneNumber || "N/A"}
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Designation:
                    </span>{" "}
                    {instructor.designation || "N/A"}
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Department:
                    </span>{" "}
                    {department.name} ({department.code})
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Department Website:
                    </span>{" "}
                    <a
                        href={department.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        {department.website}
                    </a>
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Website:
                    </span>{" "}
                    {instructor.website ? (
                        <a
                            href={instructor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            {instructor.website}
                        </a>
                    ) : (
                        "N/A"
                    )}
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Updated At:
                    </span>{" "}
                    {new Date(instructor.updatedAt).toLocaleString()}
                </div>
            </div>
        </Card>
    );
};
