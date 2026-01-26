"use client";

import { ChevronRightIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar";
import Image from "next/image";
import { cn } from "@workspace/ui/lib/utils";
import { authClient } from "@/lib/auth-client";
import type { UserRole } from "@workspace/db";
import { getSidebarOptions } from "../../constants/sidebar-options";
import { useEffect, useRef, useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";

interface DashboardSidebarProps {
    role: UserRole;
}

export const DashboardSidebar = ({ role }: DashboardSidebarProps) => {
    const sidebarOptions = getSidebarOptions(role);
    const pathname = usePathname();
    const router = useRouter();

    const scrollRef = useRef<HTMLDivElement>(null);
    const topSentinelRef = useRef<HTMLDivElement>(null);
    const bottomSentinelRef = useRef<HTMLDivElement>(null);

    const [showTopGradient, setShowTopGradient] = useState(false);
    const [showBottomGradient, setShowBottomGradient] = useState(false);

    const isActive = (url: string) => {
        if (url === "/") return pathname === "/";
        return pathname.startsWith(url);
    };

    const isSectionActive = (items: Array<{ url: string }>) => {
        return items.some((item) => isActive(item.url));
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
        <Sidebar className="group" collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            render={(props) => (
                                <Link
                                    {...props}
                                    href="/"
                                    className="flex items-center justify-center gap-2"
                                >
                                    <Image
                                        src="/logo.png"
                                        alt="IIT Ropar"
                                        width={24}
                                        height={24}
                                        priority
                                        className="p-px bg-neutral-50 rounded-xs"
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

            <SidebarContent className="flex-1 min-h-0 overflow-hidden scrollbar-hide border-r-0 shadow-none">
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
                            className="h-0 pointer-events-none mb-4"
                        />

                        <SidebarGroup>
                            <SidebarGroupLabel>Options</SidebarGroupLabel>
                            {sidebarOptions.sections.map((section) => (
                                <SidebarMenu key={section.title}>
                                    <Collapsible
                                        defaultOpen={isSectionActive(
                                            section.items
                                        )}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger
                                                render={(props) => (
                                                    <SidebarMenuButton
                                                        {...props}
                                                        tooltip={section.title}
                                                    >
                                                        {section.icon && (
                                                            <section.icon className="size-4" />
                                                        )}
                                                        <span>
                                                            {section.title}
                                                        </span>
                                                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                )}
                                            />
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {section.items.map(
                                                        (item) => (
                                                            <SidebarMenuSubItem
                                                                key={item.title}
                                                            >
                                                                <SidebarMenuSubButton
                                                                    isActive={isActive(
                                                                        item.url
                                                                    )}
                                                                    className={cn(
                                                                        isActive(
                                                                            item.url
                                                                        ) &&
                                                                            "bg-[#0b63f3]! text-neutral-200! hover:bg-[#0b63f3]/90!"
                                                                    )}
                                                                    render={(
                                                                        props
                                                                    ) => (
                                                                        <Link
                                                                            {...props}
                                                                            href={
                                                                                item.url
                                                                            }
                                                                        >
                                                                            <item.icon className="size-4" />
                                                                            <span>
                                                                                {
                                                                                    item.title
                                                                                }
                                                                            </span>
                                                                        </Link>
                                                                    )}
                                                                />
                                                            </SidebarMenuSubItem>
                                                        )
                                                    )}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                </SidebarMenu>
                            ))}
                        </SidebarGroup>
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
                    {sidebarOptions.footer?.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                isActive={isActive(item.url)}
                                className={cn(
                                    isActive(item.url) &&
                                        "bg-[#0b63f3]! text-neutral-200! hover:bg-[#0b63f3]/90!"
                                )}
                                render={(props) => (
                                    <Link {...props} href={item.url}>
                                        <item.icon className="size-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                )}
                            />
                        </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => {
                                authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            router.push("/login");
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
        </Sidebar>
    );
};
