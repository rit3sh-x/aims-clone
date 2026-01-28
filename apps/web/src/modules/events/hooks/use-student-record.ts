import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useStudentRecord = () => {
    const trpc = useTRPC();

    return useSuspenseQuery(trpc.student.self.performance.queryOptions());
};
