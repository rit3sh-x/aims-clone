import { ResetPasswordView } from "@/modules/auth/ui/views/reset-password-view";
import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/reset-password")({
    beforeLoad: async ({ context }) => {
        const { session } = context;
        if (session) {
            throw redirect({ to: "/" });
        }
    },
    component: ResetPasswordView,
});
