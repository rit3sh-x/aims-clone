import { requireAdmin } from "@/lib/auth-utils";
import { semesterParamsLoader } from "@/modules/semester/server/params-loader";
import { SemestersViewSkeleton, SemesterView } from "@/modules/semester/ui/views/semesters-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    await requireAdmin();

    const { status, type, year } = await semesterParamsLoader(searchParams);

    prefetch(
        trpc.admin.semester.list.infiniteQueryOptions(
            {
                status: status === "" ? undefined : status,
                semester: type === "" ? undefined : type,
                year: year ?? undefined,
            },
        )
    )

    return (
        <HydrateClient>
            <Suspense fallback={<SemestersViewSkeleton />}>
                <SemesterView />
            </Suspense>
        </HydrateClient>
    );
};

export default Page;
