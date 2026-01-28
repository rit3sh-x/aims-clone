import { requireStudent } from "@/lib/auth-utils";
import { StudentRecordView } from "@/modules/events/ui/views/student-record-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

const Page = async () => {
    await requireStudent();

    prefetch(trpc.student.self.performance.queryOptions());

    return (
        <HydrateClient>
            <StudentRecordView />
        </HydrateClient>
    );
};

export default Page;
