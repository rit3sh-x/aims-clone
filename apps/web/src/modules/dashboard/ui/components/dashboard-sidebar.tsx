import { LogOutIcon } from "lucide-react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import { authClient } from "@/lib/auth/client";
import { RoleType } from "@workspace/auth";
import { getSidebarOptions } from "../../constants/sidebar-options";
import { useEffect, useRef, useState } from "react";

interface DashboardSidebarProps {
    role: RoleType;
}

export const DashboardSidebar = ({ role }: DashboardSidebarProps) => {
    const sidebarOptions = getSidebarOptions(role);
    const pathname = useRouterState({
        select: (s) => s.location.pathname,
    });
    const navigate = useNavigate();

    const scrollRef = useRef<HTMLDivElement>(null);
    const topSentinelRef = useRef<HTMLDivElement>(null);
    const bottomSentinelRef = useRef<HTMLDivElement>(null);

    const [showTopGradient, setShowTopGradient] = useState(false);
    const [showBottomGradient, setShowBottomGradient] = useState(false);

    const isActive = (url: string) => {
        if (url === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(url);
    };

    useEffect(() => {
        const scrollEl = scrollRef.current;
        const topEl = topSentinelRef.current;
        const botEl = bottomSentinelRef.current;

        if (!scrollEl || !topEl || !botEl) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.target === topEl)
                        setShowTopGradient(!e.isIntersecting);
                    if (e.target === botEl)
                        setShowBottomGradient(!e.isIntersecting);
                });
            },
            {
                root: scrollEl,
                threshold: [0, 0.01, 1],
            }
        );

        observer.observe(topEl);
        observer.observe(botEl);

        return () => observer.disconnect();
    }, []);

    return (
        <Sidebar className="group h-screen flex flex-col" collapsible="icon">
            <SidebarHeader className="shrink-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            render={(props) => (
                                <Link
                                    {...props}
                                    to="/"
                                    className="flex items-center justify-center gap-2"
                                >
                                    <img
                                        src="/logo.png"
                                        alt="IIT Ropar"
                                        width={24}
                                        height={24}
                                        loading="eager"
                                    />
                                    <p className="text-lg font-bold group-data-[collapsible=icon]:hidden!">
                                        AIMS
                                    </p>
                                </Link>
                            )}
                        />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="flex-1 min-h-0 overflow-hidden scrollbar-hide">
                <div className="relative flex-1 min-h-0">
                    {showTopGradient && (
                        <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-sidebar/95 to-transparent pointer-events-none z-40" />
                    )}

                    <div
                        ref={scrollRef}
                        className="h-full overflow-y-auto scrollbar-hide relative"
                    >
                        <div
                            ref={topSentinelRef}
                            className="h-0 pointer-events-none"
                        />

                        <SidebarGroup>
                            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {sidebarOptions.dashboard.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                isActive={isActive(item.url)}
                                                className={cn(
                                                    isActive(item.url) &&
                                                        "bg-[#0b63f3]! text-sidebar-primary-foreground hover:bg-[#0b63f3]/90!"
                                                )}
                                                render={
                                                    <Link to={item.url}>
                                                        <item.icon className="size-4" />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                }
                                            />
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {sidebarOptions.sections.map((section) => (
                            <SidebarGroup key={section.title}>
                                <SidebarGroupLabel>
                                    {section.title}
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {section.items.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    isActive={isActive(
                                                        item.url
                                                    )}
                                                    className={cn(
                                                        isActive(item.url) &&
                                                            "bg-[#0b63f3]! text-sidebar-primary-foreground! hover:bg-[#0b63f3]/90!"
                                                    )}
                                                    render={(props) => (
                                                        <Link
                                                            to={item.url}
                                                            {...props}
                                                        >
                                                            <item.icon className="size-4" />
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                        </Link>
                                                    )}
                                                />
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ))}

                        <div
                            ref={bottomSentinelRef}
                            className="h-0 pointer-events-none"
                        />
                    </div>

                    {showBottomGradient && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-sidebar/95 to-transparent pointer-events-none z-40" />
                    )}
                </div>
            </SidebarContent>

            <SidebarFooter className="shrink-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => {
                                authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            navigate({ to: "/login" });
                                        },
                                    },
                                });
                            }}
                        >
                            <LogOutIcon className="size-4" />
                            Sign Out
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
};
