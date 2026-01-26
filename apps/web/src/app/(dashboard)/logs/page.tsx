import { requireAdmin } from "@/lib/auth-utils";
import { LogsView, LogsViewSkeleton } from "@/modules/logs/ui/views/logs-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { logsParamsLoader } from "@/modules/logs/server/params-loader";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    await requireAdmin();

    const { action, dateFrom, dateTo, entity } =
        await logsParamsLoader(searchParams);

    prefetch(
        trpc.admin.logs.list.infiniteQueryOptions({
            action: action === "" ? undefined : action,
            entityType: entity === "" ? undefined : entity,
            dateFrom: dateFrom ?? undefined,
            dateTo: dateTo ?? undefined,
        })
    );

    return (
        <HydrateClient>
            <Suspense fallback={<LogsViewSkeleton />}>
                <LogsView />
            </Suspense>
        </HydrateClient>
    );
};

export default Page;
