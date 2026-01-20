import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { DashboardSidebar } from "../components/dashboard-sidebar";
import { RoleType } from "@workspace/auth";
import { DashboardHeader } from "../components/dashboard-header";

interface DashboardLayoutProps {
    children: React.ReactNode;
    name: string;
    image?: string | null;
    defaultOpen: boolean;
    role: RoleType;
}

export const DashboardLayout = ({ children, image, name, defaultOpen, role }: DashboardLayoutProps) => {
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <DashboardSidebar role={role} />
            <main className="flex flex-col h-full w-full overflow-hidden">
                <DashboardHeader image={image} name={name} />
                <div className="flex-1 overflow-y-auto thin-scroll">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}