import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCourseParams } from "./use-course-params";

export const useSuspenseCourse = (courseId: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.student.course.getById.queryOptions({
            courseId,
        })
    );
};

export const useSuspenseCoursesList = () => {
    const trpc = useTRPC();
    const [{ name }] = useCourseParams();

    return useSuspenseQuery(
        trpc.student.course.list.queryOptions({
            search: name === "" ? undefined : name,
        })
    );
};
