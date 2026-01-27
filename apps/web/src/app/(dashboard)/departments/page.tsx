import { requireAdmin } from "@/lib/auth-utils";
import { departmentParamsLoader } from "@/modules/departments/server/params-loader";
import { DepartmentsView } from "@/modules/departments/ui/views/department-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    await requireAdmin();
    const { name } = await departmentParamsLoader(searchParams);

    prefetch(
        trpc.admin.department.list.queryOptions({
            search: name,
        })
    );

    return (
        <HydrateClient>
            <DepartmentsView />
        </HydrateClient>
    );
};

export default Page;
