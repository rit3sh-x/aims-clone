import { requireAuth } from "@/lib/auth-utils";
import { studentParamsLoader } from "@/modules/student/server/params-loader";
import { AdvisorStudentView } from "@/modules/student/ui/views/advisor-student-view";
import { HodStudentView } from "@/modules/student/ui/views/hod-student-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";

type Props = {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    const { user } = await requireAuth();

    if (user.role !== "ADVISOR" && user.role !== "HOD") {
        redirect("/");
    }

    const { name, year } = await studentParamsLoader(searchParams);

    if (user.role === "ADVISOR") {
        prefetch(
            trpc.advisor.student.list.infiniteQueryOptions({
                search: name === "" ? undefined : name,
                year: year ?? undefined,
            })
        );
    } else {
        prefetch(
            trpc.hod.student.list.infiniteQueryOptions({
                search: name === "" ? undefined : name,
                year: year ?? undefined,
            })
        );
    }

    if (user.role === "ADVISOR") {
        return (
            <HydrateClient>
                <AdvisorStudentView />
            </HydrateClient>
        );
    } else {
        return (
            <HydrateClient>
                <HodStudentView />
            </HydrateClient>
        );
    }
};

export default Page;
