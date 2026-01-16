import { getToken } from "@/lib/auth/server";
import { prefetch } from "@/lib/server-utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/")({
    beforeLoad: async () => {
        const token = await getToken();
        if (!token) {
            throw redirect({ to: "/login" });
        }
        return {
            session: token,
        };
    },
    loader: ({ context }) => {
        const { queryClient, trpc, session } = context;
        const { user } = session;
        prefetch(
            trpc.hello.queryOptions({
                text: user.name,
            }),
            queryClient
        );
        return { name: user.name, id: user.id };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { name, id } = Route.useLoaderData();
    const trpc = Route.useRouteContext().trpc;

    const { data } = useSuspenseQuery(trpc.hello.queryOptions({ text: name }));

    return (
        <main className="h-screen w-screen flex items-center justify-center bg-muted">
            <div className="rounded-xl bg-background p-6 shadow-md space-y-2">
                <h1 className="text-xl font-semibold">Welcome, {name} 👋</h1>
                <h1 className="text-xl font-semibold">Your ID, {id}</h1>

                <p className="text-muted-foreground">Server says:</p>

                <div className="rounded-md bg-muted px-3 py-2 text-sm font-mono">
                    {data.greeting}
                </div>
            </div>
        </main>
    );
}
