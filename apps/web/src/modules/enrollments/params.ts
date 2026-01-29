import { ENROLLMENT_STATUS } from "./constants";
import { parseAsString, parseAsStringLiteral } from "nuqs/server";

export const enrollmentParams = {
    code: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    status: parseAsStringLiteral([...ENROLLMENT_STATUS, ""])
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
};
