import { useTRPC } from "@/trpc/client";
import { useTenantParams } from "./use-tenant-params";
import {
    useSuspenseInfiniteQuery,
    useSuspenseQuery,
} from "@tanstack/react-query";

export const useSuspenseHOD = (hodId: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.admin.hod.getById.queryOptions({
            id: hodId,
        })
    );
};

export const useSuspenseHods = () => {
    const [{ departmentCode, name }] = useTenantParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.admin.hod.list.infiniteQueryOptions(
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

    const hods = query.data.pages.flatMap((page) => page.items);

    return {
        ...query,
        hods,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
};
