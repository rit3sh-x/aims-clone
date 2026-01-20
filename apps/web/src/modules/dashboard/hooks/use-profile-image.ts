import { useTRPC } from "@/lib/trpc"
import { useMutation } from "@tanstack/react-query";

export const modifyUserProfileImage = () => {
    const trpc = useTRPC();
    return useMutation(trpc.user.changeProfileImage.mutationOptions());
};

export const removeUserProfileImage = () => {
    const trpc = useTRPC();
    return useMutation(trpc.user.removeProfileImage.mutationOptions());
};