import type { TRPCQueryOptions } from "@trpc/tanstack-react-query";
import type { QueryClient } from "@tanstack/react-query";

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
    queryOptions: T,
    queryClient: QueryClient
) {
    if (queryOptions.queryKey[1]?.type === "infinite") {
        void queryClient.prefetchInfiniteQuery(queryOptions as any);
    } else {
        void queryClient.prefetchQuery(queryOptions);
    }
}
