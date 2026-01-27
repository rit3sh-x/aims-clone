import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useListFeedback = () => {
    const trpc = useTRPC();
    return useSuspenseQuery(
        trpc.admin.feedback.list.queryOptions(undefined, {
            staleTime: Infinity,
            gcTime: Infinity,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        })
    );
};

export const useCreateFeedback = () => {
    const trpc = useTRPC();

    return useMutation(
        trpc.admin.feedback.create.mutationOptions({
            onSuccess: () => {
                toast.success("Feedback questions added");
            },
            onError: () => {
                toast.error("Failed to add feedback questions");
            },
        })
    );
};

export const useUpdateFeedback = () => {
    const trpc = useTRPC();

    return useMutation(
        trpc.admin.feedback.update.mutationOptions({
            onSuccess: () => {
                toast.success("Feedback question updated");
            },
            onError: () => {
                toast.error("Failed to update feedback question");
            },
        })
    );
};

export const useDeleteFeedback = () => {
    const trpc = useTRPC();

    return useMutation(
        trpc.admin.feedback.delete.mutationOptions({
            onSuccess: () => {
                toast.success("Feedback question(s) deleted");
            },
            onError: () => {
                toast.error("Failed to delete feedback question(s)");
            },
        })
    );
};

export const useReorderFeedback = () => {
    const trpc = useTRPC();

    return useMutation(
        trpc.admin.feedback.reorder.mutationOptions({
            onSuccess: () => {
                toast.success("Feedback questions reordered");
            },
            onError: () => {
                toast.error("Failed to reorder feedback questions");
            },
        })
    );
};
