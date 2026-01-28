import type { TheoryPeriod, TutorialPeriod, LabPeriod } from "./types";

type PeriodTime = {
    start: string;
    end: string;
    display: string;
};

export const PERIOD_TIMES: Record<
    TheoryPeriod | TutorialPeriod | LabPeriod,
    PeriodTime
> = {
    "PC-1": { start: "08:00", end: "08:50", display: "08:00 - 08:50" },
    "PC-2": { start: "09:00", end: "09:50", display: "09:00 - 09:50" },
    "PC-3": { start: "10:00", end: "10:50", display: "10:00 - 10:50" },
    "PC-4": { start: "11:00", end: "11:50", display: "11:00 - 11:50" },
    PCPE: { start: "12:00", end: "12:50", display: "12:00 - 12:50" },
    HSME: { start: "13:00", end: "13:50", display: "13:00 - 13:50" },
    PCPE_PM: { start: "14:00", end: "14:50", display: "14:00 - 14:50" },
    HSPE: { start: "15:00", end: "15:50", display: "15:00 - 15:50" },
    PHSME: { start: "16:00", end: "16:50", display: "16:00 - 16:50" },
    PCDE: { start: "17:00", end: "17:50", display: "17:00 - 17:50" },
    PEOE: { start: "18:00", end: "18:50", display: "18:00 - 18:50" },
    "PCE-1": { start: "08:00", end: "08:50", display: "08:00 - 08:50" },
    "PCE-2": { start: "09:00", end: "09:50", display: "09:00 - 09:50" },
    "PCE-3": { start: "10:00", end: "10:50", display: "10:00 - 10:50" },
    S: { start: "11:00", end: "11:50", display: "11:00 - 11:50" },
    "T-PCOE": { start: "12:00", end: "12:50", display: "12:00 - 12:50" },
    "T-PCPE": { start: "08:00", end: "09:50", display: "08:00 - 09:50" },
    "T-HSPE": { start: "10:00", end: "11:50", display: "10:00 - 11:50" },
    "T-PCDE": { start: "12:00", end: "13:50", display: "12:00 - 13:50" },
    "T-PHSME": { start: "14:00", end: "15:50", display: "14:00 - 15:50" },
    "T-POE": { start: "16:00", end: "17:50", display: "16:00 - 17:50" },
    "T-PC-1": { start: "08:00", end: "09:50", display: "08:00 - 09:50" },
    "T-PC-2": { start: "10:00", end: "11:50", display: "10:00 - 11:50" },
    "T-PC-3": { start: "12:00", end: "13:50", display: "12:00 - 13:50" },
    "T-PC-4": { start: "14:00", end: "15:50", display: "14:00 - 15:50" },
    "T-HSME": { start: "16:00", end: "17:50", display: "16:00 - 17:50" },
    "T-PMS": { start: "08:00", end: "09:50", display: "08:00 - 09:50" },
    "T-S": { start: "10:00", end: "11:50", display: "10:00 - 11:50" },
    "T-PEOE": { start: "14:00", end: "15:50", display: "14:00 - 15:50" },
    "LAB-2H-1": { start: "08:00", end: "09:50", display: "08:00 - 09:50" },
    "LAB-2H-2": { start: "10:00", end: "11:50", display: "10:00 - 11:50" },
    "LAB-2H-3": { start: "12:00", end: "13:50", display: "12:00 - 13:50" },
    "LAB-2H-4": { start: "14:00", end: "15:50", display: "14:00 - 15:50" },
    "LAB-2H-5": { start: "16:00", end: "17:50", display: "16:00 - 17:50" },
    "LAB-2H-6": { start: "08:00", end: "09:50", display: "08:00 - 09:50" },
    "LAB-2H-7": { start: "10:00", end: "11:50", display: "10:00 - 11:50" },
    "LAB-2H-8": { start: "12:00", end: "13:50", display: "12:00 - 13:50" },
    "LAB-2H-9": { start: "14:00", end: "15:50", display: "14:00 - 15:50" },
    "LAB-2H-10": { start: "16:00", end: "17:50", display: "16:00 - 17:50" },
    "LAB-3H-1": { start: "08:00", end: "10:50", display: "08:00 - 10:50" },
    "LAB-3H-2": { start: "11:00", end: "13:50", display: "11:00 - 13:50" },
    "LAB-3H-3": { start: "14:00", end: "16:50", display: "14:00 - 16:50" },
    "LAB-3H-4": { start: "08:00", end: "10:50", display: "08:00 - 10:50" },
    "LAB-3H-5": { start: "11:00", end: "13:50", display: "11:00 - 13:50" },
    "LAB-3H-6": { start: "14:00", end: "16:50", display: "14:00 - 16:50" },
    "LAB-4H-1": { start: "08:00", end: "11:50", display: "08:00 - 11:50" },
    "LAB-4H-2": { start: "12:00", end: "15:50", display: "12:00 - 15:50" },
    "LAB-4H-3": { start: "16:00", end: "19:50", display: "16:00 - 19:50" },
    "LAB-4H-4": { start: "08:00", end: "11:50", display: "08:00 - 11:50" },
    "LAB-4H-5": { start: "12:00", end: "15:50", display: "12:00 - 15:50" },
    "LAB-4H-6": { start: "16:00", end: "19:50", display: "16:00 - 19:50" },
    "NCC/NSO/NSS": { start: "14:00", end: "16:00", display: "14:00 - 16:00" },
};

export function getPeriodTime(
    period: TheoryPeriod | TutorialPeriod | LabPeriod | null
): string {
    if (!period) return "";
    return PERIOD_TIMES[period]?.display || "";
}
