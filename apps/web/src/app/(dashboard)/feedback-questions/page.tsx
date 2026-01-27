import { requireAdmin } from "@/lib/auth-utils"
import { AdminFeedbackView } from "@/modules/feedback/ui/views/admin-feedback-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

const Page = async () => {
    await requireAdmin();

    prefetch(trpc.admin.feedback.list.queryOptions());

    return (
        <HydrateClient>
            <AdminFeedbackView />
        </HydrateClient>
    );
}

export default Page;