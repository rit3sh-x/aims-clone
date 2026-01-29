import { useTRPC } from "@/trpc/client";
import { useCourseParams } from "./use-course-params";
import {
    useSuspenseInfiniteQuery,
    useQueryClient,
    useMutation,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useSuspenseCourse = (id: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.hod.course.getOne.queryOptions({
            id,
        })
    );
};

export const useSuspenseCoursesList = () => {
    const [{ name, status }] = useCourseParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.hod.course.list.infiniteQueryOptions(
            {
                search: name === "" ? undefined : name,
                status: status === "" ? undefined : status,
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

    return useMutation(
        trpc.hod.course.acceptCourse.mutationOptions({
            onSuccess: async ({ id }) => {
                toast.success("Course is accepted");
                queryClient.invalidateQueries(
                    trpc.hod.course.getOne.queryOptions({
                        id,
                    })
                );
            },
            onError: () => {
                toast.error("Failed to accept the course");
            },
        })
    );
};

export const useRejectCourse = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.hod.course.rejectCourse.mutationOptions({
            onSuccess: async ({ id }) => {
                toast.success("Course is rejected");
                queryClient.invalidateQueries(
                    trpc.hod.course.getOne.queryOptions({
                        id,
                    })
                );
            },
            onError: () => {
                toast.error("Failed to reject the course");
            },
        })
    );
};
