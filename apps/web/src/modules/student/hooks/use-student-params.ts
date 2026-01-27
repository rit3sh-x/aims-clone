import { useQueryStates } from "nuqs";
import { studentParams } from "../params";

export const useStudentParams = () => {
    return useQueryStates(studentParams);
};
