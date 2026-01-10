import 'server-only';

import { createTRPCOptionsProxy, TRPCQueryOptions } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { makeQueryClient } from './query-client';
import { appRouter, createTRPCContext } from '@workspace/api';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { headers as getHeaders } from "next/headers";

export const getQueryClient = cache(makeQueryClient);

const createServerContext = async () => {
    const headers = await getHeaders();
    return createTRPCContext({ headers });
}

export const trpc = createTRPCOptionsProxy({
    ctx: createServerContext,
    router: appRouter,
    queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {props.children}
        </HydrationBoundary>
    );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
    queryOptions: T,
) {
    const queryClient = getQueryClient();
    if (queryOptions.queryKey[1]?.type === 'infinite') {
        void queryClient.prefetchInfiniteQuery(queryOptions as any);
    } else {
        void queryClient.prefetchQuery(queryOptions);
    }
}