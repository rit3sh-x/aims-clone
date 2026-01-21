import { useTRPC } from "@/lib/trpc";
import { useMutation } from "@tanstack/react-query";

export const museModifyUserProfileImage = () => {
    const trpc = useTRPC();
    return useMutation(trpc.user.changeProfileImage.mutationOptions());
};

export const useRemoveUserProfileImage = () => {
    const trpc = useTRPC();
    return useMutation(trpc.user.removeProfileImage.mutationOptions());
};
