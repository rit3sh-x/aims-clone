import { requireHOD } from "@/lib/auth-utils";
import { instructorParamsLoader } from "@/modules/instructor/server/params-loader";
import { HodInstructorsView } from "@/modules/instructor/ui/views/hod-instructors-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    await requireHOD();

    const { name } = await instructorParamsLoader(searchParams);

    prefetch(
        trpc.hod.instructor.list.infiniteQueryOptions({
            search: name === "" ? undefined : name,
        })
    );

    return (
        <HydrateClient>
            <HodInstructorsView />
        </HydrateClient>
    );
};

export default Page;
