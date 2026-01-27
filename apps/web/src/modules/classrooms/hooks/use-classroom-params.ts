import { useQueryStates } from "nuqs";
import { classroomParams } from "../params";

export const useClassroomParams = () => {
    return useQueryStates(classroomParams);
};
