import { requireAdmin } from "@/lib/auth-utils";
import { tenantParamsLoader } from "@/modules/tenant/server/params-loader";
import { HODView } from "@/modules/tenant/ui/views/hod-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    await requireAdmin();
    const { departmentCode, name } = await tenantParamsLoader(searchParams);

    prefetch(
        trpc.admin.hod.list.infiniteQueryOptions({
            departmentCode: departmentCode === "" ? undefined : departmentCode,
            search: name === "" ? undefined : name,
        })
    );

    prefetch(trpc.user.getDepartmentCodes.queryOptions());

    return (
        <HydrateClient>
            <HODView />
        </HydrateClient>
    );
};

export default Page;
