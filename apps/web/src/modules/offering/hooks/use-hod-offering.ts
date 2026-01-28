import { useTRPC } from "@/trpc/client";
import { useOfferingParams } from "./use-offering-params";
import {
    useSuspenseInfiniteQuery,
    useQueryClient,
    useMutation,
} from "@tanstack/react-query";

export const useSuspenseOfferingList = () => {
    const [{ name, code }] = useOfferingParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.hod.offering.list.infiniteQueryOptions(
            {
                search: name === "" ? undefined : name,
                courseCode: code === "" ? undefined : code,
            },
            {
                getNextPageParam: (lastPage) =>
                    lastPage.nextCursor ?? undefined,
                getPreviousPageParam: () => undefined,
            }
        )
    );

    const offerings = query.data.pages.flatMap((page) => page.items);

    return {
        offerings,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
};

export const useAcceptOffering = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ name, code }] = useOfferingParams();

    return useMutation(
        trpc.hod.offering.accept.mutationOptions({
            onSuccess: async () => {
                queryClient.invalidateQueries(
                    trpc.hod.offering.list.infiniteQueryOptions({
                        search: name === "" ? undefined : name,
                        courseCode: code === "" ? undefined : code,
                    })
                );
            },
        })
    );
};

export const useRejectOffering = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ name, code }] = useOfferingParams();

    return useMutation(
        trpc.hod.offering.reject.mutationOptions({
            onSuccess: async () => {
                queryClient.invalidateQueries(
                    trpc.hod.offering.list.infiniteQueryOptions({
                        search: name === "" ? undefined : name,
                        courseCode: code === "" ? undefined : code,
                    })
                );
            },
        })
    );
};
