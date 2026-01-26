import { requireAuth } from "@/lib/auth-utils";
import { DashboardLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
    children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
    const { user } = await requireAuth();

    if (user.role === "ADMIN") {
        prefetch(trpc.admin.metrics.recentLogs.queryOptions());
        prefetch(trpc.admin.metrics.cardMetrics.queryOptions());
        prefetch(
            trpc.admin.metrics.chartData.queryOptions({
                days: 90,
            })
        );
    }

    return (
        <HydrateClient>
            <DashboardLayout
                name={user.name}
                image={user.image}
                role={user.role}
            >
                {children}
            </DashboardLayout>
        </HydrateClient>
    );
};

export default Layout;
