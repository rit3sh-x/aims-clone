import { useTRPC } from "@/trpc/client";
import { useOfferingParams } from "./use-offering-params";
import {
    useSuspenseInfiniteQuery,
    useQueryClient,
    useMutation,
    useSuspenseQuery,
} from "@tanstack/react-query";

export const useSuspenseDepartmentCodes = () => {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.user.getDepartmentCodes.queryOptions(undefined, {
            staleTime: Infinity,
            gcTime: Infinity,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
        })
    );
};

export const useSuspenseOffering = (offeringId: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.student.offering.getById.queryOptions({
            offeringId,
        })
    );
};

export const useSuspenseOfferingList = () => {
    const [{ name, code }] = useOfferingParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.student.offering.list.infiniteQueryOptions(
            {
                search: name === "" ? undefined : name,
                departmentCode: code === "" ? undefined : code,
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

export const useEnrollOffering = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ name, code }] = useOfferingParams();

    return useMutation(
        trpc.student.offering.enroll.mutationOptions({
            onSuccess: async () => {
                queryClient.invalidateQueries(
                    trpc.student.offering.list.infiniteQueryOptions({
                        search: name === "" ? undefined : name,
                        departmentCode: code === "" ? undefined : code,
                    })
                );
            },
        })
    );
};

export const useDropOffering = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ name, code }] = useOfferingParams();

    return useMutation(
        trpc.student.offering.drop.mutationOptions({
            onSuccess: async () => {
                queryClient.invalidateQueries(
                    trpc.student.offering.list.infiniteQueryOptions({
                        search: name === "" ? undefined : name,
                        departmentCode: code === "" ? undefined : code,
                    })
                );
            },
        })
    );
};
