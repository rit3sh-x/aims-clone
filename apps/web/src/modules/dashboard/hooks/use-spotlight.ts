import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useSpotlightParams } from "./use-spotlight-params";

export const useSpotlight = () => {
    const [{ search }] = useSpotlightParams();
    const trpc = useTRPC();

    return useQuery(
        trpc.spotlight.spotlightSearch.queryOptions(
            {
                search: search.trim(),
            },
            {
                enabled: search.trim().length > 0,
                retry: false,
            }
        )
    );
};
