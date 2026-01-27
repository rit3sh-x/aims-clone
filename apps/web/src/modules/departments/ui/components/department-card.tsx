"use client";

import { useRouter } from "next/navigation";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Globe } from "lucide-react";

type Department = {
    id: string;
    name: string;
    code: string;
    website: string;
};

export const DepartmentCard = ({ department }: { department: Department }) => {
    const router = useRouter();

    const goToDepartment = () => {
        router.push(`/departments/${department.id}`);
    };

    return (
        <Card
            role="button"
            tabIndex={0}
            onClick={goToDepartment}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToDepartment();
                }
            }}
            className="
                p-4 cursor-pointer transition
                hover:bg-muted/50
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
            "
        >
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{department.name}</h3>
                    <Badge variant="outline" className="text-[10px] uppercase">
                        {department.code}
                    </Badge>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    <a
                        href={department.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline truncate max-w-60"
                    >
                        {department.website}
                    </a>
                </div>
            </div>
        </Card>
    );
};
