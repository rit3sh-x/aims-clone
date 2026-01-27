import { z } from "zod";
import {
    LIST_DEFAULT_PAGE_SIZE,
    LIST_MAX_PAGE_SIZE,
    LIST_MIN_PAGE_SIZE,
} from "../constants";

export const listStudentsInputSchema = z.object({
    search: z.string().optional(),
    year: z.number().min(2000).max(2100).optional(),
    cursor: z
        .object({
            createdAt: z.date(),
            id: z.string(),
        })
        .optional(),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
});

export const getStudentByIdSchema = z.object({
    id: z.string(),
});

export const approveEnrollmentInputSchema = z.object({
    enrollmentId: z.string(),
});

export const rejectEnrollmentInputSchema = approveEnrollmentInputSchema.extend({
    reason: z.string().min(3).optional(),
});

export const listEnrollmentsInputSchema = z.object({
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
    cursor: z
        .object({
            createdAt: z.date(),
            id: z.string(),
        })
        .optional(),
    courseCode: z.string().optional(),
});
