import { useQueryStates } from "nuqs";
import { semesterParams } from "../params";

export const useSemesterParams = () => {
    return useQueryStates(semesterParams);
};
