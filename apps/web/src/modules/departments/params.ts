import { parseAsString } from "nuqs/server";

export const departmentParams = {
    name: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};
