import { useTRPC } from "@/trpc/client";
import { useClassroomParams } from "./use-classroom-params";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

export const useSuspenseClassrooms = () => {
    const [{ name, type }] = useClassroomParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.admin.classroom.list.infiniteQueryOptions(
            {
                search: name,
                type: type === "" ? undefined : type,
            },
            {
                getNextPageParam: (lastPage) =>
                    lastPage.nextCursor ?? undefined,
                getPreviousPageParam: () => undefined,
            }
        )
    );

    const classroom = query.data.pages.flatMap((page) => page.items);

    return {
        ...query,
        classroom,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
};
