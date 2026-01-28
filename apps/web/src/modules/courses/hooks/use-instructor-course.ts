import { useTRPC } from "@/trpc/client";
import {
    useSuspenseQuery,
    useSuspenseInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { useCourseParams } from "./use-course-params";
import { toast } from "sonner";

export const useSuspenseCourse = (courseId: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.instructor.course.getById.queryOptions({
            courseId,
        })
    );
};

export const useSuspenseCoursesList = () => {
    const trpc = useTRPC();
    const [{ name }] = useCourseParams();

    return useSuspenseQuery(
        trpc.instructor.course.list.queryOptions({
            search: name === "" ? undefined : name,
        })
    );
};

export const useProposeCourse = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [{ name }] = useCourseParams();

    return useMutation(
        trpc.instructor.course.propose.mutationOptions({
            onSuccess: () => {
                toast.success("Course proposed successfully");
                queryClient.invalidateQueries(
                    trpc.instructor.course.list.queryOptions({
                        search: name,
                    })
                );
            },
            onError: (error) => {
                toast.error(error.message || "Failed to propose course");
            },
        })
    );
};

export const useProposeOffering = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.instructor.offering.propose.mutationOptions({
            onSuccess: () => {
                toast.success("Course offering proposed successfully");
                queryClient.invalidateQueries({
                    queryKey: trpc.instructor.offering.list.queryKey(),
                });
                queryClient.invalidateQueries({
                    queryKey: trpc.instructor.course.list.queryKey(),
                });
            },
            onError: (error) => {
                toast.error(error.message || "Failed to propose offering");
            },
        })
    );
};
