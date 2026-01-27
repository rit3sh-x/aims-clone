import { useQueryStates } from "nuqs";
import { departmentParams } from "../params";

export const useDepartmentParams = () => {
    return useQueryStates(departmentParams);
};
