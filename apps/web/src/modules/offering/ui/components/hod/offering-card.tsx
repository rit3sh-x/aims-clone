"use client";

import { useRouter } from "next/navigation";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { humanizeEnum } from "@/lib/formatters";
import {
    useAcceptOffering,
    useRejectOffering,
} from "../../../hooks/use-hod-offering";
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
    const acceptOffering = useAcceptOffering();
    const rejectOffering = useRejectOffering();

    const isPending = acceptOffering.isPending || rejectOffering.isPending;

    const handleAccept = () => {
        if (!disabled && !isPending) {
            acceptOffering.mutate({ id: offering.offering.id });
        }
    };

    const handleReject = () => {
        if (!disabled && !isPending) {
            rejectOffering.mutate({ id: offering.offering.id });
        }
    };

    const goToCourse = () => {
        if (!disabled && !isPending) {
            router.push(`/courses/${offering.course.id}`);
        }
    };

    return (
        <Card
            role="button"
            tabIndex={disabled || isPending ? -1 : 0}
            onClick={goToCourse}
            onKeyDown={(e) => {
                if (disabled || isPending) return;
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToCourse();
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

            {offering.offering.status === "PROPOSED" && (
                <div className="flex items-center gap-2">
                    <Button onClick={handleAccept} disabled={isPending}>
                        {acceptOffering.isPending ? "Accepting..." : "Accept"}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={isPending}
                    >
                        {rejectOffering.isPending ? "Rejecting..." : "Reject"}
                    </Button>
                </div>
            )}
        </Card>
    );
};
