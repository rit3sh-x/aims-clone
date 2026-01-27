import { requireAdmin } from "@/lib/auth-utils";
import { coursesParamsLoader } from "@/modules/courses/server/params-loader";
import {
    AdminCourseView,
    AdminCourseViewSkeleton,
} from "@/modules/courses/ui/views/admin-course-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    await requireAdmin();
    const { name, departmentCode } = await coursesParamsLoader(searchParams);

    prefetch(
        trpc.admin.course.list.infiniteQueryOptions({
            departmentCode: departmentCode === "" ? undefined : departmentCode,
            search: name === "" ? undefined : name,
        })
    );

    return (
        <HydrateClient>
            <Suspense fallback={<AdminCourseViewSkeleton />}>
                <AdminCourseView />
            </Suspense>
        </HydrateClient>
    );
};

export default Page;
