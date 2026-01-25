import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/")({
    loader: ({ context }) => {
        const { queryClient, trpc, session } = context;
        return session;
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { name, id } = Route.useLoaderData();

    return (
        <main className="flex items-center justify-center bg-background w-full h-full">
            <div className="rounded-xl bg-background p-6 shadow-md space-y-2">
                <h1 className="text-xl font-semibold">Welcome, {name} 👋</h1>
                <h1 className="text-xl font-semibold">Your ID, {id}</h1>
            </div>
        </main>
    );
}
