import { departmentCodeEnum, studentStatusEnum } from "@workspace/db";
import { z } from "zod";
import {
    DEFAULT_PAGE,
    LIST_DEFAULT_PAGE_SIZE,
    LIST_MAX_PAGE_SIZE,
    LIST_MIN_PAGE_SIZE,
} from "../constants";

export const listStudentsInputSchema = z.object({
    page: z.number().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
    search: z.string().optional(),
    year: z.number().optional(),
    programCode: z.string().optional(),
    departmentCode: z.enum(departmentCodeEnum.enumValues).optional(),
    status: z.enum(studentStatusEnum.enumValues).optional(),
});

export const getOneStudentByIdInputSchema = z.object({ studentId: z.string() });
export const approveEnrollmentInputSchema = z.object({
    enrollmentId: z.string(),
});
export const rejectEnrollmentInputSchema = approveEnrollmentInputSchema.extend({
    reason: z.string().min(3),
});
