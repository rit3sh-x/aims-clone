import { requireAdmin } from "@/lib/auth-utils";
import { StudentIdView } from "@/modules/tenant/ui/views/student-id-view";
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
        trpc.admin.student.getById.queryOptions({
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
            <StudentIdView studentId={id} userId={user.id} />
        </HydrateClient>
    );
};

export default Page;
