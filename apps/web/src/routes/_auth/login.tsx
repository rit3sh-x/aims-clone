import { getToken } from "@/lib/auth/server";
import { LoginView } from "@/modules/auth/ui/views/login-view";
import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
    beforeLoad: async () => {
        const token = await getToken();
        if (token) {
            throw redirect({ to: "/" });
        }
    },
    component: LoginView,
});
