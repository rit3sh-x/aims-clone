import { ElementType } from "react";
import { RouterOutputs } from "@workspace/api";
import type { Route } from "next";

export type SpotlightOutput = RouterOutputs["spotlight"]["spotlightSearch"];

export type SidebarItemProps = {
    title: string;
    url: Route;
    icon: ElementType;
};

export type SidebarSection = {
    title: string;
    items: SidebarItemProps[];
};

export type SidebarConfig = {
    dashboard: SidebarItemProps[];
    sections: SidebarSection[];
};

export type MetricLogs =
    RouterOutputs["admin"]["metrics"]["recentLogs"][number];