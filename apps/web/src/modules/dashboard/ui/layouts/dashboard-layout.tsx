import {
    SidebarProvider,
    SidebarInset,
} from "@workspace/ui/components/sidebar";
import { DashboardSidebar } from "../components/dashboard-sidebar";
import type { UserRole } from "@workspace/db";
import { DashboardHeader } from "../components/dashboard-header";

interface DashboardLayoutProps {
    children: React.ReactNode;
    name: string;
    image?: string | null;
    defaultOpen: boolean;
    role: UserRole;
}

export const DashboardLayout = ({
    children,
    image,
    name,
    defaultOpen,
    role,
}: DashboardLayoutProps) => {
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <DashboardSidebar role={role} />
            <SidebarInset className="rounded-xl overflow-hidden">
                <DashboardHeader image={image} name={name} />
                <div className="flex-1 overflow-y-auto">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
};
