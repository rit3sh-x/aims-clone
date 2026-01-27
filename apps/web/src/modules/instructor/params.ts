import { parseAsString } from "nuqs/server";

export const instructorParams = {
    name: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};
