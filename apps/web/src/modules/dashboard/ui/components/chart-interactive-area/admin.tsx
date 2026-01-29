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
    ToggleGroup,
    ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";

import type { ChartConfig } from "@workspace/ui/components/chart";
import { useMetricCharts } from "@/modules/dashboard/hooks/use-metrics";

type Range = "7" | "30" | "90";

const rangeToDays = (range: Range) => Number(range);

const humanize = (value: string) =>
    value.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

const chartConfig = {
    instructorApproved: {
        label: "Instructor Approved",
        color: "hsl(var(--primary))",
    },
    enrolled: {
        label: "Enrolled",
        color: "hsl(var(--success))",
    },
    pending: {
        label: "Pending",
        color: "hsl(var(--destructive))",
    },
} satisfies ChartConfig;

export function AdminChartInteractiveArea() {
    const [range, setRange] = useState<Range>("90");
    const { data: chartData } = useMetricCharts(rangeToDays(range));

    const handleRangeChange = (value: string | string[] | null) => {
        if (!value) return;
        const next = Array.isArray(value) ? value[0] : value;
        setRange(next as Range);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Enrollment Status</CardTitle>
                <CardDescription>
                    Instructor Approved, Enrolled & Pending enrollments
                </CardDescription>

                <CardAction>
                    <div className="hidden md:block">
                        <ToggleGroup
                            value={[range]}
                            onValueChange={handleRangeChange}
                            className="border border-border rounded-md"
                        >
                            <ToggleGroupItem value="90" className="h-8 px-3">
                                Last 3 months
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="30"
                                className="h-8 px-3 border-x border-border"
                            >
                                Last 30 days
                            </ToggleGroupItem>

                            <ToggleGroupItem value="7" className="h-8 px-3">
                                Last 7 days
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    <div className="block md:hidden">
                        <Select value={range} onValueChange={handleRangeChange}>
                            <SelectTrigger className="w-40" size="sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="90" className="rounded-lg">
                                    Last 3 months
                                </SelectItem>
                                <SelectItem value="30" className="rounded-lg">
                                    Last 30 days
                                </SelectItem>
                                <SelectItem value="7" className="rounded-lg">
                                    Last 7 days
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardAction>
            </CardHeader>

            <CardContent className="pt-4 w-full">
                <ChartContainer config={chartConfig} className="h-60 w-full">
                    <AreaChart data={chartData ?? []}>
                        <defs>
                            {Object.entries(chartConfig).map(([key, cfg]) => (
                                <linearGradient
                                    key={key}
                                    id={key}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={cfg.color}
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={cfg.color}
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            ))}
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
                                    formatter={(value, name) => (
                                        <div className="flex items-center justify-between gap-2 w-full">
                                            <span className="text-muted-foreground">
                                                {humanize(String(name))}:
                                            </span>
                                            <span className="font-medium tabular-nums">
                                                {value}
                                            </span>
                                        </div>
                                    )}
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
                            stroke="hsl(var(--primary))"
                        />

                        <Area
                            dataKey="enrolled"
                            stackId="a"
                            type="natural"
                            fill="url(#enrolled)"
                            stroke="hsl(var(--success))"
                        />

                        <Area
                            dataKey="pending"
                            stackId="a"
                            type="natural"
                            fill="url(#pending)"
                            stroke="hsl(var(--destructive))"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export const AdminChartInteractiveAreaSkeleton = () => {
    return (
        <Card>
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
                <div className="h-60 w-full rounded-lg bg-muted animate-pulse" />
            </CardContent>
        </Card>
    );
};
