import { requireAdmin } from "@/lib/auth-utils";
import { tenantParamsLoader } from "@/modules/tenant/server/params-loader";
import { AdvisorView } from "@/modules/tenant/ui/views/advisor-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    await requireAdmin();
    const { departmentCode, name } = await tenantParamsLoader(searchParams);

    prefetch(
        trpc.admin.advisor.list.infiniteQueryOptions({
            departmentCode: departmentCode === "" ? undefined : departmentCode,
            search: name === "" ? undefined : name,
        })
    );

    prefetch(trpc.user.getDepartmentCodes.queryOptions());

    return (
        <HydrateClient>
            <AdvisorView />
        </HydrateClient>
    );
};

export default Page;
