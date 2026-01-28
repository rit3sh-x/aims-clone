import { parseAsIsoDate } from "nuqs/server";
import { getLatestMonday } from "./utils";

export const eventsParams = {
    current: parseAsIsoDate
        .withDefault(getLatestMonday())
        .withOptions({ clearOnDefault: true }),
};
