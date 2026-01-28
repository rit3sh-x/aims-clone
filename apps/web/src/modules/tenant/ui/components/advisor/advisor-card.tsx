"use client";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import type { Advisor } from "@/modules/tenant/types";
import type { Route } from "next";

export const AdvisorCard = ({ advisorData }: { advisorData: Advisor }) => {
    return (
        <Link href={`/advisors/${advisorData.advisor.id}` as Route} passHref>
            <Card className="p-4 space-y-2 cursor-pointer hover:shadow-lg">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">
                        {advisorData.user.name}
                    </h3>

                    <Badge variant="outline" className="text-[10px] uppercase">
                        {advisorData.department.name}
                    </Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                    <div>
                        <span className="font-medium text-foreground">
                            Email:
                        </span>{" "}
                        {advisorData.user.email}
                    </div>

                    <div>
                        <span className="font-medium text-foreground">
                            Phone:
                        </span>{" "}
                        {advisorData.advisor.phoneNumber ?? "—"}
                    </div>
                </div>
            </Card>
        </Link>
    );
};
