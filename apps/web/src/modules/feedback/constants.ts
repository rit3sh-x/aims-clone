export const QUESTIONS = [
    "DESCRIPTIVE",
    "YES_NO",
    "RATING",
] as const;
export type QuestionType = (typeof QUESTIONS)[number];