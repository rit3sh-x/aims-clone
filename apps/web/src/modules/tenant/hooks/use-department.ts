import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

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
