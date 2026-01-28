import { z } from "zod";
import {
    LIST_DEFAULT_PAGE_SIZE,
    LIST_MAX_PAGE_SIZE,
    LIST_MIN_PAGE_SIZE,
} from "../constants";
import { courseStatusEnum } from "@workspace/db";

export const acceptCourseInputSchema = z.object({
    courseId: z.string(),
});

export const rejectCourseInputSchema = acceptCourseInputSchema.extend({
    reason: z.string().min(3).optional(),
});

export const listCourseInputSchema = z.object({
    search: z.string().optional(),
    status: z.enum(courseStatusEnum.enumValues).optional(),
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

export const getCourseByIdSchema = z.object({
    id: z.string(),
});

export const listBatchesInputSchema = z.object({
    programId: z.string().optional(),
    year: z.number().optional(),
    cursor: z
        .object({
            year: z.number(),
            id: z.string(),
        })
        .optional(),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
});

export const listInstructorsInputSchema = z.object({
    search: z.string().optional(),
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

export const getInstructorsByIdInputSchema = z.object({
    id: z.string(),
});

export const acceptCourseOfferingInputSchema = z.object({
    id: z.string(),
});

export const rejectCourseOfferingInputSchema = acceptCourseOfferingInputSchema;

export const listProgramsInputSchema = z.object({
    search: z.string().optional(),
    cursor: z
        .object({
            code: z.string(),
            id: z.string(),
        })
        .optional(),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
});

export const listOfferingsInputSchema = z.object({
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
    courseCode: z.string().optional(),
    search: z.string().optional(),
});

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
