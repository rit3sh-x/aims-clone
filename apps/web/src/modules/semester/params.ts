import {
    createParser,
    parseAsInteger,
    parseAsStringLiteral,
} from "nuqs/server";
import { SEMESTER_STATUS, SEMESTER_TYPE } from "./constants";

export const semesterParams = {
    status: parseAsStringLiteral([...SEMESTER_STATUS, ""])
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
    type: parseAsStringLiteral([...SEMESTER_TYPE, ""])
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
    year: parseYearRange(2000, 2100)
        .withOptions({ clearOnDefault: true }),
};

function parseYearRange(min: number, max: number) {
    return createParser({
        parse: (queryValue) => {
            const value = parseAsInteger.parse(queryValue);
            if (value === null || value < min || value > max) {
                return null;
            }
            return value;
        },
        serialize: (value) => value.toString(),
    });
}