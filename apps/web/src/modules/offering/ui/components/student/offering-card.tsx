"use client";

import { useRouter } from "next/navigation";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { humanizeEnum } from "@/lib/formatters";
import type { Offering } from "../../../types";

interface OfferingCardProps {
    offering: Offering & {
        isEnrolled: boolean;
        enrollmentStatus: string | null;
    };
    disabled?: boolean;
}

export const OfferingCard = ({
    offering,
    disabled = false,
}: OfferingCardProps) => {
    const router = useRouter();

    const goToOffering = () => {
        if (!disabled) {
            router.push(`/offerings/${offering.offering.id}`);
        }
    };

    return (
        <Card
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={goToOffering}
            onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToOffering();
                }
            }}
            className={cn(
                "p-4 space-y-2 transition",
                disabled
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

                <div className="flex flex-col gap-1 items-end">
                    <Badge variant="outline" className="text-[10px] uppercase">
                        {humanizeEnum(offering.offering.status)}
                    </Badge>
                    {offering.isEnrolled && offering.enrollmentStatus && (
                        <Badge
                            variant="secondary"
                            className="text-[10px] uppercase"
                        >
                            {humanizeEnum(offering.enrollmentStatus)}
                        </Badge>
                    )}
                </div>
            </div>

            <div className="text-xs text-muted-foreground flex gap-4">
                <span>Credits: {offering.course.credits}</span>
                <span>
                    L-T-P: {offering.course.lectureHours}-
                    {offering.course.tutorialHours}-
                    {offering.course.practicalHours}
                </span>
            </div>
        </Card>
    );
};
