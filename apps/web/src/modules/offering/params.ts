import { parseAsString } from "nuqs/server";

export const offeringParams = {
    name: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    code: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};
