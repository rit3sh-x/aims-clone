import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { UserProfile } from "./user-profile";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { BellIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SpotlightSearch } from "./spotlight-search";
import { AppMode } from "@workspace/db";
import { ModeSelector } from "@/components/mode-selector";

const getPageTitle = (pathname: string): string => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/notifications")) return "Notifications";
    if (pathname.startsWith("/settings")) return "Settings";
    if (pathname.startsWith("/automations")) return "Automations";
    if (pathname.startsWith("/portfolio")) return "Portfolio";
    if (pathname.startsWith("/strategies")) return "Strategies";
    if (pathname.startsWith("/watchlist")) return "Watchlist";
    if (pathname.startsWith("/nft")) return "NFT Marketplace";
    if (pathname.startsWith("/crypto")) return "Crypto";
    if (pathname.startsWith("/market")) return "Market";
    if (pathname.startsWith("/automations")) return "Automations";
    if (pathname.startsWith("/news")) return "News";

    return "Dashboard";
};

interface DashboardHeaderProps {
    name: string;
    image?: string | null;
    mode: AppMode;
}

export const DashboardHeader = ({
    image,
    name,
    mode,
}: DashboardHeaderProps) => {
    const trpc = useTRPC();
    const { data: hasUnreadNotifications } = useSuspenseQuery(
        trpc.notifications.hasUnread.queryOptions()
    );
    const pathname = usePathname();
    const isNotificationPage = pathname.startsWith("/notifications");
    const isMarketPage =
        pathname.startsWith("/market") ||
        pathname.startsWith("/crypto") ||
        pathname.startsWith("/nft");
    const pageTitle = getPageTitle(pathname);

    return (
        <header className="flex justify-between items-center h-14 shrink-0 gap-2 px-4 bg-background border-b">
            <div className="flex items-center justify-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <p className="text-2xl hidden md:flex">{pageTitle}</p>
            </div>
            {!isMarketPage && <SpotlightSearch mode={mode} />}
            <div className="flex items-center justify-center gap-x-4">
                <ModeSelector mode={mode} />
                <div className="items-center justify-center gap-4 hidden md:flex">
                    {!isNotificationPage && (
                        <Button
                            variant={"ghost"}
                            asChild
                            className="relative rounded-full w-10 h-10"
                        >
                            <Link href={"/notifications"}>
                                <BellIcon className="size-5" />
                                {hasUnreadNotifications && (
                                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                                )}
                            </Link>
                        </Button>
                    )}
                    <UserProfile image={image} name={name} />
                </div>
            </div>
        </header>
    );
};
