import { z } from "zod";
import {
    DAYS_OF_WEEK,
    LAB_PERIOD,
    type LabPeriod,
    SESSION_TYPE,
    THEORY_PERIOD,
    type TheoryPeriod,
    TUTORIAL_PERIOD,
    type TutorialPeriod,
} from "../constants";

export const createScheduleRowSchema = z
    .object({
        courseCode: z.string().trim().min(1, "Course code is required"),
        roomCode: z.string().trim().min(1, "Room code is required"),
        dayOfWeek: z.enum(DAYS_OF_WEEK),
        sessionType: z.enum(SESSION_TYPE),
        period: z.string().trim(),
        effectiveFrom: z
            .string()
            .trim()
            .optional()
            .transform((val) => {
                if (!val || val === "") return undefined;
                const date = new Date(val);
                if (isNaN(date.getTime())) {
                    throw new Error(
                        "Invalid effectiveFrom date format (use YYYY-MM-DD)"
                    );
                }
                return date;
            }),
        effectiveTo: z
            .string()
            .trim()
            .optional()
            .transform((val) => {
                if (!val || val === "") return undefined;
                const date = new Date(val);
                if (isNaN(date.getTime())) {
                    throw new Error(
                        "Invalid effectiveTo date format (use YYYY-MM-DD)"
                    );
                }
                return date;
            }),
    })
    .refine(
        (data) => {
            try {
                if (data.sessionType === "THEORY") {
                    THEORY_PERIOD.includes(data.period as TheoryPeriod);
                } else if (data.sessionType === "TUTORIAL") {
                    TUTORIAL_PERIOD.includes(data.period as TutorialPeriod);
                } else if (data.sessionType === "LAB") {
                    LAB_PERIOD.includes(data.period as LabPeriod);
                }
                return true;
            } catch {
                return false;
            }
        },
        {
            message: "Invalid period for the given session type",
            path: ["period"],
        }
    )
    .refine(
        (data) => {
            if (data.effectiveFrom && data.effectiveTo) {
                return data.effectiveFrom < data.effectiveTo;
            }
            return true;
        },
        {
            message: "effectiveFrom must be before effectiveTo",
            path: ["effectiveFrom"],
        }
    );
