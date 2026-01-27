"use client";

import { useBanUser, useUnBanUser } from "../../../hooks/use-users";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import { useSuspenseAdvisor } from "@/modules/tenant/hooks/use-advisor";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface AdvisorActionsCardProps {
    id: string;
}

export const AdvisorActionsCard = ({ id }: AdvisorActionsCardProps) => {
    const { data } = useSuspenseAdvisor(id);
    const { advisor, user, department } = data;
    const [isBanned, setIsBanned] = useState(user.banned);

    const banUser = useBanUser(user.id);
    const unbanUser = useUnBanUser(user.id);

    const handleBanUnban = () => {
        if (isBanned) {
            unbanUser.mutate(
                { id: user.id },
                {
                    onSuccess: () => setIsBanned(false),
                }
            );
        } else {
            banUser.mutate(
                { id: user.id },
                {
                    onSuccess: () => setIsBanned(true),
                }
            );
        }
    };

    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <Badge variant={isBanned ? "destructive" : "secondary"}>
                    {isBanned ? "Banned" : "Active"}
                </Badge>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
                <div>
                    <span className="font-medium text-foreground">Email:</span>{" "}
                    {user.email}
                </div>
                <div>
                    <span className="font-medium text-foreground">Phone:</span>{" "}
                    {advisor.phoneNumber ?? "—"}
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Department:
                    </span>{" "}
                    {department.name} ({department.code})
                </div>
                <div>
                    <span className="font-medium text-foreground">
                        Website:
                    </span>{" "}
                    <a
                        href={advisor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        {advisor.website || "N/A"}
                    </a>
                </div>
            </div>

            <div className="pt-4">
                <Button
                    variant={isBanned ? "secondary" : "destructive"}
                    onClick={handleBanUnban}
                    disabled={banUser.isPending || unbanUser.isPending}
                >
                    {isBanned ? "Unban User" : "Ban User"}
                </Button>
            </div>
        </Card>
    );
};

export const AdvisorActionsCardSkeleton = () => {
    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>

            <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
            </div>

            <div className="pt-4">
                <Skeleton className="h-10 w-32" />
            </div>
        </Card>
    );
};
