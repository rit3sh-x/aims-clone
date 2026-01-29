"use client";

import dynamic from "next/dynamic";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { UserProfile } from "./user-profile";
import { SpotlightSearchSkeleton } from "./spotlight-search";
import { usePathname } from "next/navigation";

const SpotlightSearch = dynamic(
    () => import("./spotlight-search").then((mod) => mod.SpotlightSearch),
    {
        ssr: false,
        loading: () => <SpotlightSearchSkeleton />,
    }
);

const getPageTitle = (pathname: string): string => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    return formatSegment(segments[0]!);
};

const formatSegment = (segment: string) =>
    segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

interface DashboardHeaderProps {
    name: string;
    image?: string | null;
}

export const DashboardHeader = ({ image, name }: DashboardHeaderProps) => {
    const pathname = usePathname();
    const pageTitle = getPageTitle(pathname);

    return (
        <header className="flex w-full justify-between items-center h-14 shrink-0 gap-2 px-4 bg-background border-b">
            <div className="flex items-center justify-center gap-2">
                <SidebarTrigger />
                <p className="text-2xl hidden md:flex">{pageTitle}</p>
            </div>
            <SpotlightSearch />
            <UserProfile image={image} name={name} />
        </header>
    );
};
