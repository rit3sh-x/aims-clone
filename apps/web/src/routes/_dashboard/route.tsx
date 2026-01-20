import { getSidebarState } from "@/lib/utils";
import { spotlightSearchSchema } from "@/modules/dashboard/schema/spotlight-schema";
import { DashboardLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout";
import {
    createFileRoute,
    Outlet,
    redirect,
    stripSearchParams,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard")({
    validateSearch: spotlightSearchSchema,
    search: {
        middlewares: [stripSearchParams({ search: "" })],
    },
    beforeLoad: async ({ context }) => {
        const sidebarOpen = await getSidebarState();
        const { session } = context;
        if (!session) {
            throw redirect({ to: "/login" });
        }
        return {
            session: {
                name: session.user.name,
                image: session.user.image,
                id: session.user.id,
                role: session.user.role,
            },
            sidebarOpen,
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { session, sidebarOpen } = Route.useRouteContext();
    return (
        <DashboardLayout
            defaultOpen={sidebarOpen}
            name={session.name}
            image={session.image}
            role={session.role}
        >
            <Outlet />
        </DashboardLayout>
    )
}