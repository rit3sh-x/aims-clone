"use client";

import { useRouter } from "next/navigation";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { humanizeEnum } from "@/lib/formatters";
import {
    useEnrollOffering,
    useDropOffering,
} from "../../../hooks/use-student-offering";
import type { Offering } from "../../../types";

interface OfferingCardProps {
    offering: Offering;
    disabled?: boolean;
}

export const OfferingCard = ({
    offering,
    disabled = false,
}: OfferingCardProps) => {
    const router = useRouter();
    const enrollOffering = useEnrollOffering();
    const dropOffering = useDropOffering();

    const isPending = enrollOffering.isPending || dropOffering.isPending;

    const handleEnroll = () => {
        if (!disabled && !isPending) {
            enrollOffering.mutate({ offeringId: offering.offering.id });
        }
    };

    const handleDrop = () => {
        if (!disabled && !isPending) {
            dropOffering.mutate({ offeringId: offering.offering.id });
        }
    };

    const goToOffering = () => {
        if (!disabled && !isPending) {
            router.push(`/offering/${offering.offering.id}`);
        }
    };

    return (
        <Card
            role="button"
            tabIndex={disabled || isPending ? -1 : 0}
            onClick={goToOffering}
            onKeyDown={(e) => {
                if (disabled || isPending) return;
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToOffering();
                }
            }}
            className={cn(
                "p-4 space-y-2 transition",
                disabled || isPending
                    ? "opacity-60 pointer-events-none"
                    : "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h3 className="font-semibold text-sm">
                        {offering.course.code}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {offering.course.title}
                    </p>
                </div>

                <Badge variant="outline" className="text-[10px] uppercase">
                    {humanizeEnum(offering.offering.status)}
                </Badge>
            </div>

            <div className="text-xs text-muted-foreground flex gap-4">
                <span>Credits: {offering.course.credits}</span>
                <span>
                    L-T-P: {offering.course.lectureHours}-
                    {offering.course.tutorialHours}-
                    {offering.course.practicalHours}
                </span>
            </div>

            {offering.offering.status === "ENROLLING" && (
                <div className="flex items-center gap-2">
                    <Button onClick={handleEnroll} disabled={isPending}>
                        {enrollOffering.isPending ? "Enrolling..." : "Enroll"}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDrop}
                        disabled={isPending}
                    >
                        {dropOffering.isPending ? "Dropping..." : "Drop"}
                    </Button>
                </div>
            )}
        </Card>
    );
};
