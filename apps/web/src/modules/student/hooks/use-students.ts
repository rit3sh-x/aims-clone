import { useTRPC } from "@/trpc/client";
import { useStudentParams } from "./use-student-params";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteAdvisorStudents = () => {
    const [{ name, year }] = useStudentParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.advisor.student.list.infiniteQueryOptions(
            {
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

export const useInfiniteHodStudents = () => {
    const [{ name, year }] = useStudentParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.hod.student.list.infiniteQueryOptions(
            {
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
