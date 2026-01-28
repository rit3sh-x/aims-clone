"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import type { Hod } from "@/modules/tenant/types";
import type { Route } from "next";

export const HODCard = ({ hodData }: { hodData: Hod }) => {
    const routeParam = hodData.hod.id;
    return (
        <Link href={`/hods/${routeParam}` as Route} passHref>
            <Card className="p-4 space-y-2 cursor-pointer hover:shadow-lg">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">
                        {hodData.user.name}
                    </h3>

                    <Badge variant="outline" className="text-[10px] uppercase">
                        {hodData.department.name}
                    </Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                    <div>
                        <span className="font-medium text-foreground">
                            Email:
                        </span>{" "}
                        {hodData.user.email}
                    </div>

                    <div>
                        <span className="font-medium text-foreground">
                            Phone:
                        </span>{" "}
                        {hodData.hod.phoneNumber ?? "—"}
                    </div>
                </div>
            </Card>
        </Link>
    );
};
