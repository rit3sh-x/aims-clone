import { requireStudent } from "@/lib/auth-utils";
import { eventsParamsLoader } from "@/modules/events/server/params-loader";
import { ScheduleView } from "@/modules/events/ui/views/schedule-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";

interface Props {
    searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
    await requireStudent();

    const { current } = await eventsParamsLoader(searchParams);

    prefetch(trpc.student.schedule.current.queryOptions());

    prefetch(
        trpc.student.attendance.list.queryOptions({
            weekStart: current,
        })
    );

    return (
        <HydrateClient>
            <ScheduleView />
        </HydrateClient>
    );
};

export default Page;
