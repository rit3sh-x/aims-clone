"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { formatDistanceToNow } from "date-fns";
import { humanizeEnum } from "@/lib/formatters";
import type { Enrollment } from "../../types";
import type { UserRole } from "@workspace/db";

interface EnrollmentCardProps {
    enrollment: Enrollment;
    onAccept: (enrollmentId: string) => void;
    onReject: (enrollmentId: string) => void;
    isLoading?: boolean;
    role: UserRole;
}

export const EnrollmentCard = ({
    enrollment,
    onAccept,
    onReject,
    isLoading = false,
    role,
}: EnrollmentCardProps) => {
    const {
        enrollment: enrollmentData,
        student,
        user,
        course,
        batch,
        program,
    } = enrollment;

    const handleAccept = () => {
        onAccept(enrollmentData.id);
    };

    const handleReject = () => {
        onReject(enrollmentData.id);
    };

    return (
        <Card className="p-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{user.name}</h3>
                        <Badge variant="outline" className="text-[10px]">
                            {student.rollNo}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {user.email}
                    </p>
                </div>

                <Badge
                    variant="secondary"
                    className="text-[10px] uppercase whitespace-nowrap"
                >
                    {humanizeEnum(enrollmentData.status)}
                </Badge>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Course:</span>
                    <span className="font-medium">
                        {course.code} - {course.title}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Program:</span>
                    <span className="font-medium">
                        {program.code} - {batch.year}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Credits:</span>
                    <span className="font-medium">{course.credits}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Requested:</span>
                    <span className="font-medium">
                        {formatDistanceToNow(
                            new Date(enrollmentData.createdAt),
                            {
                                addSuffix: true,
                            }
                        )}
                    </span>
                </div>

                {enrollmentData.instructorApprovedAt && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Instructor Approved:
                        </span>
                        <span className="font-medium text-xs">
                            {new Date(
                                enrollmentData.instructorApprovedAt
                            ).toLocaleString()}
                        </span>
                    </div>
                )}

                {enrollmentData.advisorApprovedAt && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Advisor Approved:
                        </span>
                        <span className="font-medium text-xs">
                            {new Date(
                                enrollmentData.advisorApprovedAt
                            ).toLocaleString()}
                        </span>
                    </div>
                )}
            </div>

            {((enrollmentData.status === "PENDING" && role === "INSTRUCTOR") ||
                (enrollmentData.status === "INSTRUCTOR_APPROVED" &&
                    role === "ADVISOR")) && (
                <div className="flex items-center gap-2 pt-2">
                    <Button
                        variant="default"
                        onClick={handleAccept}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Accept
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Reject
                    </Button>
                </div>
            )}
        </Card>
    );
};
