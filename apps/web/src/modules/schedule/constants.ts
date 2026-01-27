export const DAYS_OF_WEEK = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
] as const;

export const SESSION_TYPE = ["THEORY", "TUTORIAL", "LAB"] as const;

export const THEORY_PERIOD = [
    "PC-1",
    "PC-2",
    "PC-3",
    "PC-4",
    "PCPE",
    "HSME",
    "PCPE_PM",
    "HSPE",
    "PHSME",
    "PCDE",
    "PEOE",
    "PCE-1",
    "PCE-2",
    "PCE-3",
    "S",
    "T-PCOE",
] as const;
export type TheoryPeriod = (typeof THEORY_PERIOD)[number];

export const LAB_PERIOD = [
    "LAB-2H-1",
    "LAB-2H-2",
    "LAB-2H-3",
    "LAB-2H-4",
    "LAB-2H-5",
    "LAB-2H-6",
    "LAB-2H-7",
    "LAB-2H-8",
    "LAB-2H-9",
    "LAB-2H-10",
    "LAB-3H-1",
    "LAB-3H-2",
    "LAB-3H-3",
    "LAB-3H-4",
    "LAB-3H-5",
    "LAB-3H-6",
    "LAB-4H-1",
    "LAB-4H-2",
    "LAB-4H-3",
    "LAB-4H-4",
    "LAB-4H-5",
    "LAB-4H-6",
    "NCC/NSO/NSS",
] as const;
export type LabPeriod = (typeof LAB_PERIOD)[number];

export const TUTORIAL_PERIOD = [
    "T-PCPE",
    "T-HSPE",
    "T-PCDE",
    "T-PHSME",
    "T-POE",
    "T-PC-1",
    "T-PC-2",
    "T-PC-3",
    "T-PC-4",
    "T-HSME",
    "T-PMS",
    "T-S",
    "T-PCOE",
    "T-PEOE",
] as const;
export type TutorialPeriod = (typeof TUTORIAL_PERIOD)[number];
