import { useTRPC } from "@/trpc/client";
import { useTenantParams } from "./use-tenant-params";
import {
    useSuspenseInfiniteQuery,
    useSuspenseQuery,
} from "@tanstack/react-query";

export const useSuspenseStudent = (studentId: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.admin.student.getById.queryOptions({
            id: studentId,
        })
    );
};

export const useSuspenseStudents = () => {
    const [{ departmentCode, name, year }] = useTenantParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.admin.student.list.infiniteQueryOptions(
            {
                departmentCode:
                    departmentCode === "" ? undefined : departmentCode,
                search: name === "" ? undefined : name,
                year: year ?? undefined,
            },
            {
                getNextPageParam: (lastPage) =>
                    lastPage.nextCursor ?? undefined,
                getPreviousPageParam: () => undefined,
            }
        )
    );

    const students = query.data.pages.flatMap((page) => page.students);

    return {
        ...query,
        students,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
};
