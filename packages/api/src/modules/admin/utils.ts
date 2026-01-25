import { semester } from "@workspace/db";
import { sql } from "drizzle-orm";

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
