import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@workspace/ui/components/chart";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";

import type { ChartConfig } from "@workspace/ui/components/chart";
import { useMetricCharts } from "@/modules/dashboard/hooks/use-metrics";

const chartConfig = {
    instructorApproved: {
        label: "Instructor Approved",
        color: "var(--primary)",
    },
    advisorApproved: {
        label: "Advisor Approved",
        color: "var(--success)",
    },
    pending: {
        label: "Pending",
        color: "var(--destructive)",
    },
} satisfies ChartConfig;

type Range = 7 | 30 | 90;

export function AdminChartInteractiveArea() {
    const [range, setRange] = useState<Range>(90);
    const { data: chartData } = useMetricCharts(range);

    const handleRangeChange = (value: Range | null) => {
        if (value !== null) setRange(value);
    };

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Enrollments</CardTitle>
                <CardDescription>
                    Instructor vs Advisor approvals vs Pending
                </CardDescription>

                <CardAction>
                    <Select value={range} onValueChange={handleRangeChange}>
                        <SelectTrigger className="w-40" size="sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={90}>Last 3 months</SelectItem>
                            <SelectItem value={30}>Last 30 days</SelectItem>
                            <SelectItem value={7}>Last 7 days</SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>

            <CardContent className="pt-4">
                <ChartContainer config={chartConfig} className="h-62.5">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient
                                id="instructorApproved"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-instructorApproved)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-instructorApproved)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>

                            <linearGradient
                                id="advisorApproved"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-advisorApproved)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-advisorApproved)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>

                            <linearGradient
                                id="pending"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-pending)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-pending)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="date"
                            tickFormatter={(v) =>
                                new Date(v).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }
                        />

                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    indicator="dot"
                                    labelFormatter={(v) =>
                                        new Date(v).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                            }
                                        )
                                    }
                                />
                            }
                        />

                        <Area
                            dataKey="instructorApproved"
                            stackId="a"
                            type="natural"
                            fill="url(#instructorApproved)"
                            stroke="var(--color-instructorApproved)"
                        />

                        <Area
                            dataKey="advisorApproved"
                            stackId="a"
                            type="natural"
                            fill="url(#advisorApproved)"
                            stroke="var(--color-advisorApproved)"
                        />

                        <Area
                            dataKey="pending"
                            stackId="a"
                            type="natural"
                            fill="url(#pending)"
                            stroke="var(--color-pending)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export const AdminChartInteractiveAreaSkeleton = () => {
    return (
        <Card className="@container/card">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
                        <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                    </div>
                    <div className="h-8 w-40 rounded bg-muted animate-pulse" />
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                <div className="h-62.5 w-full rounded-lg bg-muted animate-pulse" />
            </CardContent>
        </Card>
    );
};
