import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { UserProfile } from "./user-profile";
import { headers as getHeaders } from "next/headers";
import { SpotlightSearch } from "./spotlight-search";

const getPageTitle = (pathname: string): string => {
    const segment = pathname.split("/").filter(Boolean)[0];
    if (!segment) return "Dashboard";
    return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

interface DashboardHeaderProps {
    name: string;
    image?: string | null;
}

export const DashboardHeader = async ({
    image,
    name,
}: DashboardHeaderProps) => {
    const headers = await getHeaders();
    const pathname = headers.get("x-path") || "";
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
