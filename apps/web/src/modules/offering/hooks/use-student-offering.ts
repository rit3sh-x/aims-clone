import { useTRPC } from "@/trpc/client";
import { useOfferingParams } from "./use-offering-params";
import {
    useSuspenseInfiniteQuery,
    useQueryClient,
    useMutation,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

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

    return useMutation(
        trpc.student.offering.enroll.mutationOptions({
            onSuccess: async ({ offeringId }) => {
                toast.success("Successfully enrolled in offering");
                queryClient.invalidateQueries(
                    trpc.student.offering.getById.queryOptions({
                        offeringId,
                    })
                );
            },
            onError: (error) => {
                toast.error(error.message || "Failed to enroll");
            },
        })
    );
};

export const useDropOffering = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.student.offering.drop.mutationOptions({
            onSuccess: async ({ offeringId }) => {
                toast.success("Successfully dropped offering");
                queryClient.invalidateQueries(
                    trpc.student.offering.getById.queryOptions({
                        offeringId,
                    })
                );
            },
            onError: (error) => {
                toast.error(error.message || "Failed to drop offering");
            },
        })
    );
};
