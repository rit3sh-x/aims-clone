import { requireAdmin } from "@/lib/auth-utils";
import type { SearchParams } from "nuqs/server";
import { departmentParamsLoader } from "@/modules/departments/server/params-loader";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { DepartmentIdView } from "@/modules/departments/ui/views/department-id-view";

interface Props {
    params: Promise<{
        departmentId: string;
    }>;
    searchParams: Promise<SearchParams>;
}

const Page = async ({ params, searchParams }: Props) => {
    await requireAdmin();
    const { departmentId } = await params;
    const { name } = await departmentParamsLoader(searchParams);

    prefetch(
        trpc.admin.department.getById.queryOptions({
            id: departmentId,
        })
    );
    prefetch(
        trpc.admin.department.listFaculty.infiniteQueryOptions({
            departmentId,
            search: name,
        })
    );

    return (
        <HydrateClient>
            <DepartmentIdView departmentId={departmentId} />
        </HydrateClient>
    );
};

export default Page;
