import { formatDistanceToNow } from "date-fns";
import { UserPlus, Trash2, Edit3, Info } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { humanizeEnum } from "@/lib/formatters";
import type { AuditAction, AuditEntity } from "../../constants";

type AuditLog = {
    id: number;
    action: AuditAction;
    entityType: AuditEntity;
    entityId: string | null;
    createdAt: Date;
    ipAddress: string | null;
};

const actionIcons: Record<string, React.ReactNode> = {
    CREATE: <UserPlus className="size-4 text-green-500" />,
    UPDATE: <Edit3 className="size-4 text-blue-500" />,
    DELETE: <Trash2 className="size-4 text-destructive" />,
    DEFAULT: <Info className="size-4 text-muted-foreground" />,
};

export const LogCard = ({ log }: { log: AuditLog }) => {
    const Icon = actionIcons[log.action] || actionIcons.DEFAULT;

    return (
        <Card className="p-4 hover:bg-muted/50 transition-colors border-l-4 border-l-primary/20">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-full border shadow-sm">
                        {Icon}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm leading-none capitalize">
                                {humanizeEnum(log.action)}{" "}
                                {humanizeEnum(log.entityType)}
                            </span>
                            <Badge
                                variant="outline"
                                className="text-[10px] px-1 py-0 uppercase"
                            >
                                ID: {log.entityId?.slice(0, 8) ?? "N/A"}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {log.ipAddress && `From ${log.ipAddress}`}
                        </p>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <p className="text-[11px] font-medium text-muted-foreground">
                        {/* Uses date-fns for relative timing */}
                        {formatDistanceToNow(log.createdAt, {
                            addSuffix: true,
                        })}
                    </p>
                </div>
            </div>
        </Card>
    );
};
