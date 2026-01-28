import { parseAsString, parseAsStringLiteral } from "nuqs/server";
import { COURSE_STATUS } from "./constants";

export const coursesParams = {
    name: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    departmentCode: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
    status: parseAsStringLiteral([...COURSE_STATUS, ""])
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
};
