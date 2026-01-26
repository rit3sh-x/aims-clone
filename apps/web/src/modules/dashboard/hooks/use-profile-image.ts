import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export const useModifyUserProfileImage = () => {
    const trpc = useTRPC();
    return useMutation(trpc.user.changeProfileImage.mutationOptions());
};

export const useRemoveUserProfileImage = () => {
    const trpc = useTRPC();
    return useMutation(trpc.user.removeProfileImage.mutationOptions());
};
