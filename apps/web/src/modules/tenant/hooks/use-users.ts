import { useTRPC } from "@/trpc/client";
import {
    useMutation,
    useSuspenseQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error) return error.message;
    return fallback;
};

export const useBanUser = (userId: string) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.admin.user.ban.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(
                    trpc.admin.user.listUserSessions.queryOptions({
                        id: userId,
                    })
                );
                toast.success("User banned successfully");
            },
            onError: (error) => {
                toast.error(getErrorMessage(error, "Failed to ban user"));
            },
        })
    );
};

export const useUnBanUser = (userId: string) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.admin.user.unban.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(
                    trpc.admin.user.listUserSessions.queryOptions({
                        id: userId,
                    })
                );
                toast.success("User unbanned successfully");
            },
            onError: (error) => {
                toast.error(getErrorMessage(error, "Failed to unban user"));
            },
        })
    );
};

export const useListUserSessions = (userId: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.admin.user.listUserSessions.queryOptions({
            id: userId,
        })
    );
};

export const useRevokeSession = (userId: string) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.admin.user.revokeSession.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(
                    trpc.admin.user.listUserSessions.queryOptions({
                        id: userId,
                    })
                );
                toast.success("Session revoked successfully");
            },
            onError: (error) => {
                toast.error(getErrorMessage(error, "Failed to revoke session"));
            },
        })
    );
};

export const useRevokeAllSession = (userId: string) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.admin.user.revokeAllSessions.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(
                    trpc.admin.user.listUserSessions.queryOptions({
                        id: userId,
                    })
                );
                toast.success("All user sessions revoked");
            },
            onError: (error) => {
                toast.error(
                    getErrorMessage(error, "Failed to revoke all sessions")
                );
            },
        })
    );
};
