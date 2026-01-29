import { useTRPC } from "@/trpc/client";
import { useCourseParams } from "./use-course-params";
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

export const useSuspenseCourse = (id: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.admin.course.getOne.queryOptions({
            id,
        })
    );
};

export const useSuspenseCoursesList = () => {
    const [{ departmentCode, name }] = useCourseParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.admin.course.list.infiniteQueryOptions(
            {
                departmentCode:
                    departmentCode === "" ? undefined : departmentCode,
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

export const useSuspenseCourseOfferings = (courseId: string) => {
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.admin.offering.list.infiniteQueryOptions(
            {
                courseId,
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

export const useAcceptCourse = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.admin.course.acceptCourse.mutationOptions({
            onSuccess: async ({ id }) => {
                toast.success("Course is accepted");
                queryClient.invalidateQueries(
                    trpc.admin.course.getOne.queryOptions({
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
        trpc.admin.course.rejectCourse.mutationOptions({
            onSuccess: async ({ id }) => {
                toast.success("Course is rejected");
                queryClient.invalidateQueries(
                    trpc.admin.course.getOne.queryOptions({
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
