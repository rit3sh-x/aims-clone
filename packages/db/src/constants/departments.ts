import { DepartmentCode } from "../schema";

export const DEPARTMENT_LABELS: Record<DepartmentCode, string> = {
    CSB: "Computer Science & Business",
    CSE: "Computer Science & Engineering",
    AI: "Artificial Intelligence",
    DS: "Data Science",
    IT: "Information Technology",
    ECE: "Electronics & Communication Engineering",
    EEE: "Electrical & Electronics Engineering",
    ME: "Mechanical Engineering",
    CE: "Civil Engineering",
    CHE: "Chemical Engineering",
    META: "Metallurgical Engineering",
    BIOTECH: "Biotechnology",
    MATHS: "Mathematics",
    PHYS: "Physics",
    CHEM: "Chemistry",
} as const;
