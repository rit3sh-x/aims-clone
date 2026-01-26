import { parseAsIsoDate, parseAsStringLiteral } from "nuqs/server";
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from "./constants";

export const logsParams = {
    action: parseAsStringLiteral([...AUDIT_ACTIONS, ""])
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
    entity: parseAsStringLiteral([...AUDIT_ENTITIES, ""])
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
    dateFrom: parseAsIsoDate,
    dateTo: parseAsIsoDate,
};
