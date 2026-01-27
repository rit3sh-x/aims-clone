import { useTRPC } from "@/trpc/client";
import { useTenantParams } from "./use-tenant-params";
import {
    useSuspenseInfiniteQuery,
    useSuspenseQuery,
} from "@tanstack/react-query";

export const useSuspenseAdvisor = (advisorId: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.admin.advisor.getById.queryOptions({
            id: advisorId,
        })
    );
};

export const useSuspenseAdvisors = () => {
    const [{ departmentCode, name }] = useTenantParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.admin.advisor.list.infiniteQueryOptions(
            {
                departmentCode:
                    departmentCode === "" ? undefined : departmentCode,
                search: name === "" ? undefined : name,
            },
            {
                getNextPageParam: (lastPage) =>
                    lastPage.nextCursor ?? undefined,
                getPreviousPageParam: () => undefined,
            }
        )
    );

    const advisors = query.data.pages.flatMap((page) => page.items);

    return {
        ...query,
        advisors,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
};
