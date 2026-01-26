import { parseAsString } from "nuqs/server";

export const spotlightParams = {
    search: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true })
}