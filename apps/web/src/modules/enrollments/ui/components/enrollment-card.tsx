"use client";

import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { formatDistanceToNow } from "date-fns";
import type { Enrollment } from "../../types";

interface EnrollmentCardProps {
    enrollment: Enrollment;
    onAccept: (enrollmentId: string) => void;
    onReject: (enrollmentId: string) => void;
}

export const EnrollmentCard = ({
    enrollment,
    onAccept,
    onReject,
}: EnrollmentCardProps) => {
    const { enrollment: enrollmentData, student } = enrollment;

    const handleAccept = () => {
        onAccept(enrollmentData.id);
    };

    const handleReject = () => {
        onReject(enrollmentData.id);
    };

    return (
        <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-sm">
                        {student.rollNo} - {enrollmentData.id.slice(0, 8)}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Created{" "}
                        {formatDistanceToNow(
                            new Date(enrollmentData.createdAt),
                            { addSuffix: true }
                        )}
                    </p>
                </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
                <div>
                    <span className="font-medium text-foreground">
                        Student ID:
                    </span>{" "}
                    {student.id}
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Offering ID:
                    </span>{" "}
                    {enrollmentData.offeringId}
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Advisor Approved At:
                    </span>{" "}
                    {enrollmentData.advisorApprovedAt
                        ? new Date(
                              enrollmentData.advisorApprovedAt
                          ).toLocaleString()
                        : "Not Approved"}
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Instructor Approved At:
                    </span>{" "}
                    {enrollmentData.instructorApprovedAt
                        ? new Date(
                              enrollmentData.instructorApprovedAt
                          ).toLocaleString()
                        : "Not Approved"}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handleAccept}>
                    Accept
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                    Reject
                </Button>
            </div>
        </Card>
    );
};
