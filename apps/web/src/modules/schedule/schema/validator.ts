import * as Papa from "papaparse";
import { z } from "zod";
import { createScheduleRowSchema } from "./schema";

export const validateCreateSchedulesCSV = (csvContent: string) => {
    return new Promise<{
        valid: z.infer<typeof createScheduleRowSchema>[];
        errors: Array<{ row: number; errors: string[] }>;
    }>((resolve) => {
        const valid: z.infer<typeof createScheduleRowSchema>[] = [];
        const errors: Array<{ row: number; errors: string[] }> = [];

        Papa.parse<Record<string, unknown>>(csvContent, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim(),

            complete: (results) => {
                if (results.errors.length > 0) {
                    errors.push(
                        ...results.errors.map((err) => ({
                            row: err.row != null ? err.row + 2 : 0,
                            errors: [err.message],
                        }))
                    );
                }

                results.data.forEach((row, index) => {
                    const result = createScheduleRowSchema.safeParse(row);

                    if (result.success) {
                        valid.push(result.data);
                    } else {
                        errors.push({
                            row: index + 2,
                            errors: result.error.issues.map(
                                (e) => `${e.path.join(".")}: ${e.message}`
                            ),
                        });
                    }
                });

                resolve({ valid, errors });
            },
        });
    });
};
