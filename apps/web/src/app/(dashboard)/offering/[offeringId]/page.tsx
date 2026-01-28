import { requireStudent } from "@/lib/auth-utils";
import { StudentOfferingIdView } from "@/modules/offering/ui/views/student-offering-id-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
    params: Promise<{
        offeringId: string;
    }>;
}

const Page = async ({ params }: Props) => {
    await requireStudent();
    const { offeringId } = await params;

    prefetch(
        trpc.student.offering.getById.queryOptions({
            offeringId,
        })
    );

    return (
        <HydrateClient>
            <StudentOfferingIdView offeringId={offeringId} />
        </HydrateClient>
    );
};
