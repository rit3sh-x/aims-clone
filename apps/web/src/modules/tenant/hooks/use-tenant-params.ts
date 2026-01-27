import { useQueryStates } from "nuqs";
import { tenantParams } from "../params";

export const useTenantParams = () => {
    return useQueryStates(tenantParams);
};
