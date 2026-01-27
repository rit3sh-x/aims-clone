import { useQueryStates } from "nuqs";
import { coursesParams } from "../params";

export const useCourseParams = () => {
    return useQueryStates(coursesParams);
};
