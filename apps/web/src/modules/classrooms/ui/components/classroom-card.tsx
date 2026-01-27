"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { ClassroomType } from "../../constants";

type Classroom = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    type: ClassroomType;
    room: string;
    building: string | null;
    capacity: number | null;
};

export const ClassroomCard = ({ classroom }: { classroom: Classroom }) => {
    return (
        <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                    Room {classroom.room}
                </h3>

                <Badge variant="outline" className="text-[10px] uppercase">
                    {classroom.type}
                </Badge>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
                <div>
                    <span className="font-medium text-foreground">
                        Building:
                    </span>{" "}
                    {classroom.building ?? "—"}
                </div>

                <div>
                    <span className="font-medium text-foreground">
                        Capacity:
                    </span>{" "}
                    {classroom.capacity ?? "—"}
                </div>
            </div>
        </Card>
    );
};
