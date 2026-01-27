import { useQueryStates } from "nuqs";
import { enrollmentParams } from "../params";

export const useEnrollmentParams = () => {
    return useQueryStates(enrollmentParams);
};
