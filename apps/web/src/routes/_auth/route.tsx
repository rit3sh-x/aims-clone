import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { ErrorUI } from "@/components/error-ui";
import { getToken } from "@/lib/auth/server";

export const Route = createFileRoute("/_auth")({
    beforeLoad: async () => {
        const token = await getToken();
        if (token) {
            throw redirect({ to: "/" });
        }
    },
    errorComponent: ErrorUI,
    component: AuthLayout,
});
