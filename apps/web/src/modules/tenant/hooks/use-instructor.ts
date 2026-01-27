import { useTRPC } from "@/trpc/client";
import { useTenantParams } from "./use-tenant-params";
import {
    useSuspenseInfiniteQuery,
    useSuspenseQuery,
} from "@tanstack/react-query";

export const useSuspenseInstructor = (instructorId: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.admin.instructor.getById.queryOptions({
            id: instructorId,
        })
    );
};

export const useSuspenseInstructors = () => {
    const [{ departmentCode, name }] = useTenantParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.admin.instructor.list.infiniteQueryOptions(
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

    const instructors = query.data.pages.flatMap((page) => page.items);

    return {
        ...query,
        instructors,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
};
