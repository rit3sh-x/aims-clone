import { format } from "date-fns";
import { MoreVertical, Play, StopCircle, Pencil } from "lucide-react";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import { cn } from "@workspace/ui/lib/utils";
import { humanizeEnum } from "@/lib/formatters";
import type { SemesterStatus, SemesterType } from "../../constants";

type Semester = {
    id: string;
    year: number;
    semester: SemesterType;
    status: SemesterStatus;
    startDate: Date;
    endDate: Date;
    enrollmentDeadline: Date;
};

interface SemesterCardProps {
    semester: Semester;
    onEdit: (id: string) => void;
    onStart: (id: string) => void;
    onEnd: (id: string) => void;
    disabled?: boolean;
}

export const SemesterCard = ({
    semester,
    onEdit,
    onStart,
    onEnd,
    disabled = false,
}: SemesterCardProps) => {
    const { id, year, semester: term, status } = semester;

    return (
        <Card
            className={cn(
                "p-4 flex flex-row justify-between items-start gap-4 transition-colors",
                disabled
                    ? "opacity-60 pointer-events-none"
                    : "hover:bg-muted/50"
            )}
        >
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">
                        {humanizeEnum(term)} {year}
                    </h3>
                    <Badge variant="outline" className="text-[10px] uppercase">
                        {humanizeEnum(status)}
                    </Badge>
                </div>

                <p className="text-xs text-muted-foreground">
                    {format(semester.startDate, "dd MMM yyyy")} →{" "}
                    {format(semester.endDate, "dd MMM yyyy")}
                </p>

                <p className="text-xs text-muted-foreground">
                    Enrollment deadline:{" "}
                    {format(semester.enrollmentDeadline, "dd MMM yyyy")}
                </p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger
                    render={(props) => (
                        <Button
                            {...props}
                            variant="ghost"
                            size="icon"
                            className="ml-auto shrink-0"
                            disabled={disabled}
                        >
                            <MoreVertical className="size-4" />
                        </Button>
                    )}
                />

                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => onEdit(id)}>
                        <Pencil className="mr-2 size-4" />
                        Modify
                    </DropdownMenuItem>

                    {status === "UPCOMING" && (
                        <DropdownMenuItem onClick={() => onStart(id)}>
                            <Play className="mr-2 size-4" />
                            Start semester
                        </DropdownMenuItem>
                    )}

                    {status === "ONGOING" && (
                        <DropdownMenuItem onClick={() => onEnd(id)}>
                            <StopCircle className="mr-2 size-4" />
                            End semester
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </Card>
    );
};
