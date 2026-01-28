import { useTRPC } from "@/trpc/client";
import { useEventsParams } from "./use-event-params";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useCurrentSchedule = () => {
    const trpc = useTRPC();

    return useSuspenseQuery(trpc.student.schedule.current.queryOptions());
};

export const useWeeklyAttendance = () => {
    const trpc = useTRPC();
    const [{ current }] = useEventsParams();

    return useSuspenseQuery(
        trpc.student.attendance.list.queryOptions({
            weekStart: current,
        })
    );
};
