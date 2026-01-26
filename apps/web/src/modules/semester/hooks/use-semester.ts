import { useTRPC } from "@/trpc/client";
import { useSemesterParams } from "./use-semester-params";
import {
    useSuspenseInfiniteQuery,
    useQueryClient,
    useMutation,
} from "@tanstack/react-query";

export const useInfiniteSemesters = () => {
    const [{ status, type, year }] = useSemesterParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.admin.semester.list.infiniteQueryOptions(
            {
                status: status === "" ? undefined : status,
                semester: type === "" ? undefined : type,
                year: year ?? undefined,
            },
            {
                getNextPageParam: (lastPage) =>
                    lastPage.nextCursor ?? undefined,
                getPreviousPageParam: () => undefined,
            }
        )
    );

    const semesters = query.data.pages.flatMap((page) => page.items);

    return {
        semesters,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
};

export const useCreateSemester = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ status, type, year }] = useSemesterParams();

    return useMutation(
        trpc.admin.semester.create.mutationOptions({
            onSuccess: async () => {
                queryClient.invalidateQueries(
                    trpc.admin.semester.list.infiniteQueryOptions({
                        status: status === "" ? undefined : status,
                        semester: type === "" ? undefined : type,
                        year: year ?? undefined,
                    })
                );
            },
        })
    );
};

export const useStartSemester = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ status, type, year }] = useSemesterParams();

    return useMutation(
        trpc.admin.semester.start.mutationOptions({
            onSuccess: async () => {
                queryClient.invalidateQueries(
                    trpc.admin.semester.list.infiniteQueryOptions({
                        status: status === "" ? undefined : status,
                        semester: type === "" ? undefined : type,
                        year: year ?? undefined,
                    })
                );
            },
        })
    );
};

export const useEndSemester = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ status, type, year }] = useSemesterParams();

    return useMutation(
        trpc.admin.semester.end.mutationOptions({
            onSuccess: async () => {
                queryClient.invalidateQueries(
                    trpc.admin.semester.list.infiniteQueryOptions({
                        status: status === "" ? undefined : status,
                        semester: type === "" ? undefined : type,
                        year: year ?? undefined,
                    })
                );
            },
        })
    );
};

export const useUpdateSemester = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ status, type, year }] = useSemesterParams();

    return useMutation(
        trpc.admin.semester.update.mutationOptions({
            onSuccess: async () => {
                queryClient.invalidateQueries(
                    trpc.admin.semester.list.infiniteQueryOptions({
                        status: status === "" ? undefined : status,
                        semester: type === "" ? undefined : type,
                        year: year ?? undefined,
                    })
                );
            },
        })
    );
};
