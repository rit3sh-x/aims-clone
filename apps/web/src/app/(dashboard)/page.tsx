import { requireAuth } from "@/lib/auth-utils";
import { AdminDashboardView } from "@/modules/dashboard/ui/views/admin-dashboard-view";
import { HydrateClient, trpc, prefetch } from "@/trpc/server";

const Page = async () => {
    const { user } = await requireAuth();

    switch (user.role) {
        case "ADMIN": {
            prefetch(trpc.admin.metrics.recentLogs.queryOptions());
            prefetch(trpc.admin.metrics.cardMetrics.queryOptions());
            prefetch(trpc.admin.metrics.chartData.queryOptions({ days: 90 }));
        }
    }

    switch (user.role) {
        case "ADMIN":
            return (
                <HydrateClient>
                    <AdminDashboardView role={user.role} />
                </HydrateClient>
            );
        default:
            return null;
    }
};

export default Page;
