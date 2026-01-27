"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { useRouter } from "next/navigation";
import type { Hod } from "@/modules/tenant/types";

export const HODCard = ({ hodData }: { hodData: Hod }) => {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/hod/${hodData.hod.id}`);
    };

    return (
        <Card
            className="p-4 space-y-2 cursor-pointer hover:shadow-lg"
            onClick={handleCardClick}
        >
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{hodData.user.name}</h3>

                <Badge variant="outline" className="text-[10px] uppercase">
                    {hodData.department.name}
                </Badge>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
                <div>
                    <span className="font-medium text-foreground">Email:</span>{" "}
                    {hodData.user.email}
                </div>

                <div>
                    <span className="font-medium text-foreground">Phone:</span>{" "}
                    {hodData.hod.phoneNumber ?? "—"}
                </div>
            </div>
        </Card>
    );
};
