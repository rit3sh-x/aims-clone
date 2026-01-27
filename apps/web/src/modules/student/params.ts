import { createParser, parseAsInteger, parseAsString } from "nuqs/server";

export const studentParams = {
    name: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    year: parseYearRange(2000, 2100).withOptions({ clearOnDefault: true }),
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
