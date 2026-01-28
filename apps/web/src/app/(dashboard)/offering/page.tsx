import { requireAuth } from "@/lib/auth-utils";
import { offeringParamsLoader } from "@/modules/offering/server/params-loader";
import { HodOfferingView } from "@/modules/offering/ui/views/hod-offering-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    const { user } = await requireAuth();

    if (user.role === "ADVISOR" || user.role === "ADMIN") {
        redirect("/");
    }

    const { name, code } = await offeringParamsLoader(searchParams);

    prefetch(trpc.user.getDepartmentCodes.queryOptions());

    switch (user.role) {
        case "HOD": {
            prefetch(
                trpc.hod.offering.list.infiniteQueryOptions({
                    search: name === "" ? undefined : name,
                    courseCode: code === "" ? undefined : code,
                })
            );

            return (
                <HydrateClient>
                    <HodOfferingView />
                </HydrateClient>
            );
        }
        case "INSTRUCTOR": {
        }
        case "STUDENT": {
        }
        default:
            return null;
    }
};

export default Page;
