import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { ErrorUI } from "@/components/error-ui";

export const Route = createFileRoute("/_auth")({
    beforeLoad: async ({ context }) => {
        const { session } = context;
        if (session) {
            throw redirect({ to: "/" });
        }
    },
    errorComponent: ErrorUI,
    component: AuthLayout,
});