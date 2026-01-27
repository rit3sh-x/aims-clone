import { parseAsString, parseAsStringLiteral } from "nuqs/server";
import { CLASSROOMS } from "./constants";

export const classroomParams = {
    name: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    type: parseAsStringLiteral([...CLASSROOMS, ""])
        .withDefault("")
        .withOptions({ clearOnDefault: true })
};
