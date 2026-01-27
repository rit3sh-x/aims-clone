import { useTRPC } from "@/trpc/client";
import { useCourseParams } from "./use-course-params";
import {
    useSuspenseInfiniteQuery,
    useQueryClient,
    useMutation,
    useSuspenseQuery,
} from "@tanstack/react-query";

export const useSuspenseCourse = (id: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.hod.course.getOne.queryOptions({
            id,
        })
    );
};

export const useSuspenseCoursesList = () => {
    const [{ name }] = useCourseParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.hod.course.list.infiniteQueryOptions(
            {
                search: name === "" ? undefined : name,
            },
            {
                getNextPageParam: (lastPage) =>
                    lastPage.nextCursor ?? undefined,
                getPreviousPageParam: () => undefined,
            }
        )
    );

    const courses = query.data.pages.flatMap((page) => page.courses);

    return {
        courses,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
};

export const useAcceptCourse = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ departmentCode, name }] = useCourseParams();

    return useMutation(
        trpc.hod.course.acceptCourse.mutationOptions({
            onSuccess: async () => {
                queryClient.invalidateQueries(
                    trpc.hod.course.list.infiniteQueryOptions({
                        search: name === "" ? undefined : name,
                    })
                );
            },
        })
    );
};

export const useRejectCourse = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ departmentCode, name }] = useCourseParams();

    return useMutation(
        trpc.hod.course.rejectCourse.mutationOptions({
            onSuccess: async () => {
                queryClient.invalidateQueries(
                    trpc.hod.course.list.infiniteQueryOptions({
                        search: name === "" ? undefined : name,
                    })
                );
            },
        })
    );
};
