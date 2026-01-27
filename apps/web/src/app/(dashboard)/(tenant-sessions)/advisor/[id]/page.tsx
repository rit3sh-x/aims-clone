import { requireAdmin } from "@/lib/auth-utils";
import { AdvisorIdView } from "@/modules/tenant/ui/views/advisor-id-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const Page = async ({ params }: Props) => {
    const { user } = await requireAdmin();
    const { id } = await params;

    prefetch(
        trpc.admin.hod.getById.queryOptions({
            id,
        })
    );
    prefetch(
        trpc.admin.user.listUserSessions.queryOptions({
            id: user.id,
        })
    );

    return (
        <HydrateClient>
            <AdvisorIdView advisorId={id} userId={user.id} />
        </HydrateClient>
    );
};

export default Page;
