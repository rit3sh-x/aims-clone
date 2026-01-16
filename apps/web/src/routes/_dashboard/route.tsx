import { getToken } from "@/lib/auth/server";
import { spotlightSearch } from "@/modules/dashboard/schema/spotligh-schema";
import {
    createFileRoute,
    redirect,
    stripSearchParams,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard")({
    validateSearch: spotlightSearch,
    search: {
        middlewares: [stripSearchParams({ search: "" })],
    },
    beforeLoad: async () => {
        const token = await getToken();
        if (!token) {
            throw redirect({ to: "/login" });
        }
        return {
            session: {
                name: token.user.name,
                image: token.user.image,
            },
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { session } = Route.useRouteContext();
    const { search } = Route.useSearch();
    return <div>Hello "/_dashboard"!</div>;
}
