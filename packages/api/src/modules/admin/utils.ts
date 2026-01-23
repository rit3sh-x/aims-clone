import { semester } from "@workspace/db";
import { randomBytes } from "crypto";
import { sql } from "drizzle-orm";

export function randomHex(length = 32): string {
    if (length < 8 || length > 64) {
        throw new Error("length must be between 8 and 64");
    }

    return randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
}

export const semesterOverlapCondition = (
    start: Date,
    end: Date,
    excludeId?: string
) =>
    sql`
        daterange(${semester.startDate}, ${semester.endDate}, '[]')
        && daterange(${start}, ${end}, '[]')
        ${excludeId ? sql`AND ${semester.id} <> ${excludeId}` : sql``}
    `;
