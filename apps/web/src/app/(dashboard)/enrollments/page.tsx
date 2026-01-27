import { requireAuth } from "@/lib/auth-utils";
import { enrollmentParamsLoader } from "@/modules/enrollments/server/params-loader";
import { AdvisorEnrollmentView } from "@/modules/enrollments/ui/views/advisor-enrollment-view";
import { InstructorEnrollmentView } from "@/modules/enrollments/ui/views/instructor-enrollment-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    const { user } = await requireAuth();

    if (user.role !== "ADVISOR" && user.role !== "INSTRUCTOR") {
        redirect("/");
    }

    const { code } = await enrollmentParamsLoader(searchParams);

    if (user.role === "ADVISOR") {
        prefetch(
            trpc.advisor.enrollment.list.infiniteQueryOptions({
                courseCode: code === "" ? undefined : code,
            })
        );
    } else {
        prefetch(
            trpc.instructor.enrollment.list.infiniteQueryOptions({
                courseCode: code === "" ? undefined : code,
            })
        );
    }

    if (user.role === "ADVISOR") {
        return (
            <HydrateClient>
                <AdvisorEnrollmentView />
            </HydrateClient>
        );
    } else {
        return (
            <HydrateClient>
                <InstructorEnrollmentView />
            </HydrateClient>
        );
    }
};

export default Page;
