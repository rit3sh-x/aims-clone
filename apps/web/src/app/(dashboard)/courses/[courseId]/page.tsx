import { requireAuth } from "@/lib/auth-utils";
import { AdminCourseIdView } from "@/modules/courses/ui/views/admin-course-id-view";
import { HodCourseIdView } from "@/modules/courses/ui/views/hod-course-id-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";

type Props = {
    params: Promise<{
        courseId: string;
    }>;
};

const Page = async ({ params }: Props) => {
    const { user } = await requireAuth();

    if (user.role === "ADVISOR") {
        redirect("/");
    }
    const { courseId } = await params;

    switch (user.role) {
        case "ADMIN": {
            prefetch(
                trpc.admin.course.getOne.queryOptions({
                    id: courseId,
                })
            );

            prefetch(
                trpc.admin.offering.list.infiniteQueryOptions({
                    courseId,
                })
            );

            return (
                <HydrateClient>
                    <AdminCourseIdView courseId={courseId} />
                </HydrateClient>
            );
        }
        case "HOD": {
            trpc.hod.course.getOne.queryOptions({
                id: courseId,
            });

            return (
                <HydrateClient>
                    <HodCourseIdView courseId={courseId} />
                </HydrateClient>
            );
        }
        case "INSTRUCTOR": {
        }
        case "STUDENT": {
        }
        default:
            return null;
    }
};

export default Page;
