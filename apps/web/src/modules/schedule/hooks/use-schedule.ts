import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateSchedule = () => {
    const trpc = useTRPC();

    return useMutation(
        trpc.admin.schedule.createBulkSchedules.mutationOptions({
            onSuccess: () => {
                toast.success("Created schedule successfully");
            },
            onError: () => {
                toast.error("Failed to create schedule");
            },
        })
    );
};
