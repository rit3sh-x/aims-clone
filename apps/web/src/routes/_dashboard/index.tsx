import { DashboardView } from "@/modules/dashboard/ui/views/dashboard-view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/")({
    loader: ({ context }) => {
        const { session } = context;
        return session;
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { role } = Route.useLoaderData();

    return <DashboardView role={role} />;
}
