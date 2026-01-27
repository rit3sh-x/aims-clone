"use client";

import {
    useListUserSessions,
    useRevokeSession,
    useRevokeAllSession,
} from "../../../hooks/use-users";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@workspace/ui/components/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface AdvisorSessionsProps {
    userId: string;
}

export const AdvisorSessions = ({ userId }: AdvisorSessionsProps) => {
    const { data: sessions } = useListUserSessions(userId);
    const revokeSession = useRevokeSession(userId);
    const revokeAllSessions = useRevokeAllSession(userId);

    const handleRevokeSession = (sessionId: string) => {
        revokeSession.mutate({ sessionToken: sessionId });
    };

    const handleRevokeAllSessions = () => {
        revokeAllSessions.mutate({ userId });
    };

    if (!sessions || sessions.length === 0) {
        return (
            <Card className="p-6 text-center">
                <p className="text-muted-foreground">
                    No active sessions found for this user.
                </p>
            </Card>
        );
    }

    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Active Sessions</h3>
                <Button
                    variant="destructive"
                    onClick={handleRevokeAllSessions}
                    disabled={revokeAllSessions.isPending}
                >
                    Revoke All Sessions
                </Button>
            </div>

            <div className="space-y-4">
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className="flex items-center justify-between p-4 border rounded-md bg-muted/10"
                    >
                        <div>
                            <p className="font-medium text-sm">
                                Device: {session.userAgent || "Unknown Device"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                IP Address: {session.ipAddress || "Unknown"}
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={(props) => (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        {...props}
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                )}
                            />
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleRevokeSession(session.id)
                                    }
                                    disabled={revokeSession.isPending}
                                >
                                    Revoke Session
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const AdvisorSessionsSkeleton = () => {
    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-md bg-muted/10"
                    >
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                ))}
            </div>
        </Card>
    );
};
