import { requireAdmin } from "@/lib/auth-utils";
import { LogsView } from "@/modules/logs/ui/views/logs-view";
import { HydrateClient } from "@/trpc/server";

const Page = async () => {
    await requireAdmin();

    return (
        <HydrateClient>
            <LogsView />
        </HydrateClient>
    )
}

export default Page;