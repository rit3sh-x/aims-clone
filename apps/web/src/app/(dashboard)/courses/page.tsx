import { requireAuth } from "@/lib/auth-utils";
import { coursesParamsLoader } from "@/modules/courses/server/params-loader";
import {
    AdminCourseView,
    AdminCourseViewSkeleton,
} from "@/modules/courses/ui/views/admin-course-view";
import { HodCourseView } from "@/modules/courses/ui/views/hod-course-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    const { user } = await requireAuth();

    if (user.role === "ADVISOR") {
        redirect("/");
    }

    const { name, departmentCode } = await coursesParamsLoader(searchParams);

    prefetch(trpc.user.getDepartmentCodes.queryOptions());

    switch (user.role) {
        case "ADMIN": {
            prefetch(
                trpc.admin.course.list.infiniteQueryOptions({
                    departmentCode:
                        departmentCode === "" ? undefined : departmentCode,
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
        }
        case "HOD": {
            prefetch(
                trpc.hod.course.list.infiniteQueryOptions({
                    search: name === "" ? undefined : name,
                })
            );

            return (
                <HydrateClient>
                    <HodCourseView />
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
