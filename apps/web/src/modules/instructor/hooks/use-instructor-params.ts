import { useQueryStates } from "nuqs";
import { instructorParams } from "../params";

export const useInstructorParams = () => {
    return useQueryStates(instructorParams);
};
