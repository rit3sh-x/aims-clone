import { useTRPC } from "@/trpc/client";
import { useEnrollmentParams } from "./use-enrollment-params";
import {
    useMutation,
    useQueryClient,
    useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useInfiniteInstructorEnrollments = () => {
    const [{ code }] = useEnrollmentParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.instructor.enrollment.list.infiniteQueryOptions(
            {
                courseCode: code === "" ? undefined : code,
            },
            {
                getNextPageParam: (lastPage) =>
                    lastPage.nextCursor ?? undefined,
                getPreviousPageParam: () => undefined,
            }
        )
    );

    const enrollments = query.data.pages.flatMap((page) => page.items);

    return {
        ...query,
        enrollments,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
};

export const useInfiniteAdvisorEnrollments = () => {
    const [{ code }] = useEnrollmentParams();
    const trpc = useTRPC();

    const query = useSuspenseInfiniteQuery(
        trpc.advisor.enrollment.list.infiniteQueryOptions(
            {
                courseCode: code === "" ? undefined : code,
            },
            {
                getNextPageParam: (lastPage) =>
                    lastPage.nextCursor ?? undefined,
                getPreviousPageParam: () => undefined,
            }
        )
    );

    const enrollments = query.data.pages.flatMap((page) => page.items);

    return {
        ...query,
        enrollments,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
};

export const useInstructorApproveEnrollment = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ code }] = useEnrollmentParams();

    return useMutation(
        trpc.instructor.enrollment.approve.mutationOptions({
            onSuccess: () => {
                toast.success("Enrollment approved successfully");
                queryClient.invalidateQueries(
                    trpc.instructor.enrollment.list.infiniteQueryOptions({
                        courseCode: code === "" ? undefined : code,
                    })
                );
            },
            onError: (error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to approve enrollment"
                );
            },
        })
    );
};

export const useInstructorRejectEnrollment = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ code }] = useEnrollmentParams();

    return useMutation(
        trpc.instructor.enrollment.reject.mutationOptions({
            onSuccess: () => {
                toast.success("Enrollment rejected successfully");
                queryClient.invalidateQueries(
                    trpc.instructor.enrollment.list.infiniteQueryOptions({
                        courseCode: code === "" ? undefined : code,
                    })
                );
            },
            onError: (error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to reject enrollment"
                );
            },
        })
    );
};

export const useAdvisorApproveEnrollment = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ code }] = useEnrollmentParams();

    return useMutation(
        trpc.advisor.enrollment.approve.mutationOptions({
            onSuccess: () => {
                toast.success("Enrollment approved successfully");
                queryClient.invalidateQueries(
                    trpc.advisor.enrollment.list.infiniteQueryOptions({
                        courseCode: code === "" ? undefined : code,
                    })
                );
            },
            onError: (error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to approve enrollment"
                );
            },
        })
    );
};

export const useAdvisorRejectEnrollment = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ code }] = useEnrollmentParams();

    return useMutation(
        trpc.advisor.enrollment.reject.mutationOptions({
            onSuccess: () => {
                toast.success("Enrollment rejected successfully");
                queryClient.invalidateQueries(
                    trpc.advisor.enrollment.list.infiniteQueryOptions({
                        courseCode: code === "" ? undefined : code,
                    })
                );
            },
            onError: (error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to reject enrollment"
                );
            },
        })
    );
};
