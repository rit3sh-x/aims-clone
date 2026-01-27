import { useTRPC } from "@/trpc/client";
import { useDepartmentParams } from "./use-department-params";
import {
    useSuspenseInfiniteQuery,
    useSuspenseQuery,
} from "@tanstack/react-query";

export const useSuspenseDepartments = () => {
    const [{ name }] = useDepartmentParams();
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.admin.department.list.queryOptions({
            search: name,
        })
    );
};

export const useSuspenseDepartment = (departmentId: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.admin.department.getById.queryOptions({
            id: departmentId,
        })
    );
};

export const useSuspenseListDepartmentFaculty = (departmentId: string) => {
    const [{ name }] = useDepartmentParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.admin.department.listFaculty.infiniteQueryOptions(
            {
                search: name,
                departmentId,
            },
            {
                getNextPageParam: (lastPage) =>
                    lastPage.nextCursor ?? undefined,
                getPreviousPageParam: () => undefined,
            }
        )
    );

    const faculty = query.data.pages.flatMap((page) => page.items);

    return {
        ...query,
        faculty,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
};
