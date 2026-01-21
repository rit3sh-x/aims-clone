import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";

export const useSpotlight = (search: string) => {
    const trpc = useTRPC();

    return useQuery(
        trpc.spotlight.spotlightSearch.queryOptions(
            {
                search,
            },
            {
                enabled: search.trim.length > 0,
            }
        )
    );
};
