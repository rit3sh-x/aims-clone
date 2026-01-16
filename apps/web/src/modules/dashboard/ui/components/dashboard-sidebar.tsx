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

interface DashboardSidebarProps {
    role: RoleType;
}

export const DashboardSidebar = ({ role }: DashboardSidebarProps) => {
    const sidebarOptions = getSidebarOptions(role);
    const pathname = useRouterState({
        select: (s) => s.location.pathname,
    });
    const navigate = useNavigate();

    const isActive = (url: string) => {
        if (url === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(url);
    };

    return (
        <Sidebar className="group" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size={"lg"}
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
                                    <p className="text-xl font-black group-data-[collapsible=icon]:hidden!">
                                        AIMS
                                    </p>
                                </Link>
                            )}
                        />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Dashboard Section */}
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarOptions.dashboard.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={isActive(item.url)}
                                        className={cn(
                                            isActive(item.url) &&
                                                "bg-[#0b63f3]! text-sidebar-primary-foreground! hover:bg-[#0b63f3]/90!"
                                        )}
                                        render={(props) => (
                                            <Link to={item.url} {...props}>
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        )}
                                    />
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {sidebarOptions.sections.map((section) => (
                    <SidebarGroup key={section.title}>
                        <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {section.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={isActive(item.url)}
                                            className={cn(
                                                isActive(item.url) &&
                                                    "bg-[#0b63f3]! text-sidebar-primary-foreground! hover:bg-[#0b63f3]/90!"
                                            )}
                                            render={(props) => (
                                                <Link to={item.url} {...props}>
                                                    <item.icon className="size-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            )}
                                        />
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
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
