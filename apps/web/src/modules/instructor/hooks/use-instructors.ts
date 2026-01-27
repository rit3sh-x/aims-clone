import { useTRPC } from "@/trpc/client";
import { useInstructorParams } from "./use-instructor-params";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteHodInstructors = () => {
    const [{ name }] = useInstructorParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.hod.instructor.list.infiniteQueryOptions(
            {
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
