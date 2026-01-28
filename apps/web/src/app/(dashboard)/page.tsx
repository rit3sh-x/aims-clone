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
            return (
                <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-semibold">
                            Welcome to AIMS Portal
                        </h1>
                        <p className="text-muted-foreground">
                            Use the navigation to get started
                        </p>
                    </div>
                </div>
            );
    }
};

export default Page;
