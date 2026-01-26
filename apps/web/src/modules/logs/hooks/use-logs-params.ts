import { useQueryStates } from "nuqs";
import { logsParams } from "../params";

export const useLogsParams = () => {
    return useQueryStates(logsParams);
};
