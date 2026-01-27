import { parseAsString } from "nuqs/server";

export const enrollmentParams = {
    code: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};
