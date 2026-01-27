import { requireAdmin } from "@/lib/auth-utils";
import { tenantParamsLoader } from "@/modules/tenant/server/params-loader";
import { StudentView } from "@/modules/tenant/ui/views/student-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    await requireAdmin();
    const { departmentCode, name, year } =
        await tenantParamsLoader(searchParams);

    prefetch(
        trpc.admin.student.list.infiniteQueryOptions({
            departmentCode: departmentCode === "" ? undefined : departmentCode,
            search: name === "" ? undefined : name,
            year: year ?? undefined,
        })
    );

    prefetch(trpc.user.getDepartmentCodes.queryOptions());

    return (
        <HydrateClient>
            <StudentView />
        </HydrateClient>
    );
};

export default Page;
