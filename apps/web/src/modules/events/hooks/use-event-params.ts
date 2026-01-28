import { useQueryStates } from "nuqs";
import { eventsParams } from "../params";

export const useEventsParams = () => {
    return useQueryStates(eventsParams);
};
