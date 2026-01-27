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

export const checkDateRangeOverlap = (
    start1: Date | undefined,
    end1: Date | undefined,
    start2: Date | undefined,
    end2: Date | undefined
): boolean => {
    if (!start1 || !end1 || !start2 || !end2) {
        return true;
    }
    return start1 <= end2 && start2 <= end1;
};
