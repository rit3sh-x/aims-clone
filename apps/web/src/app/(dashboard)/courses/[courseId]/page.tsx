import { requireAdmin } from "@/lib/auth-utils";
import { AdminCourseIdView } from "@/modules/courses/ui/views/admin-course-id-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

type Props = {
    params: Promise<{
        courseId: string;
    }>
};

const Page = async ({ params }: Props) => {
    await requireAdmin();
    const { courseId } = await params;

    prefetch(trpc.admin.course.getOne.queryOptions({
        id: courseId,
    }));

    prefetch(trpc.admin.offering.list.infiniteQueryOptions({
        courseId
    }));

    return (
        <HydrateClient>
            <AdminCourseIdView courseId={courseId} />
        </HydrateClient>
    )
}

export default Page;