import { ElementType } from "react";
import { RouterOutputs } from "@workspace/api";
import type { AppRoutes } from "@/types/routes";

export type SpotlightOutput = RouterOutputs["spotlight"]["spotlightSearch"];

export type SidebarItemProps = {
    title: string;
    url: AppRoutes;
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
