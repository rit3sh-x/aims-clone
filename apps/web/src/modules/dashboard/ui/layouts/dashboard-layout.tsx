import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar";
import { DashboardSidebar } from "../components/dashboard-sidebar";
import type { UserRole } from "@workspace/db";
import { DashboardHeader } from "../components/dashboard-header";
import { cookies as getCookies } from "next/headers";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorUI } from "@/components/error-ui";

interface DashboardLayoutProps {
    children: React.ReactNode;
    name: string;
    image?: string | null;
    role: UserRole;
}

export const DashboardLayout = async ({
    children,
    image,
    name,
    role,
}: DashboardLayoutProps) => {
    const cookies = await getCookies();
    const defaultOpen = cookies.get("sidebar_state")?.value === "true";

    return (
        <ErrorBoundary fallback={<ErrorUI />}>
            <SidebarProvider defaultOpen={defaultOpen}>
                <DashboardSidebar role={role} />
                <SidebarInset className="rounded-xl overflow-hidden">
                    <DashboardHeader image={image} name={name} />
                    <main className="flex-1 overflow-y-auto min-h-0">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ErrorBoundary>
    );
};
