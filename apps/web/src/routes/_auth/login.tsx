import { LoginView } from "@/modules/auth/ui/views/login-view";
import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
    beforeLoad: async ({ context }) => {
        const { session } = context;
        if (session) {
            throw redirect({ to: "/" });
        }
    },
    component: LoginView,
});
