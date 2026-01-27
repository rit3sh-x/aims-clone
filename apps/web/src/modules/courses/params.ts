import { parseAsString } from "nuqs/server";

export const coursesParams = {
    name: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    departmentCode: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
};
