import { requireAdmin } from "@/lib/auth-utils";
import { classroomParamsLoader } from "@/modules/classrooms/server/params-loader";
import { ClassroomView } from "@/modules/classrooms/ui/views/classroom-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    await requireAdmin();
    const { name } = await classroomParamsLoader(searchParams);

    prefetch(trpc.admin.classroom.list.infiniteQueryOptions({
        search: name === "" ? undefined: name,
    }));

    return (
        <HydrateClient>
            <ClassroomView />
        </HydrateClient>
    )
}

export default Page;