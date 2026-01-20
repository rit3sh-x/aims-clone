import { offeringStatusEnum } from "@workspace/db";
import { z } from "zod";
import {
    DEFAULT_PAGE,
    LIST_DEFAULT_PAGE_SIZE,
    LIST_MAX_PAGE_SIZE,
    LIST_MIN_PAGE_SIZE,
} from "../constants";

export const proposeOfferingInputSchema = z.object({
    courseId: z.string(),
    semesterId: z.string(),
    maxCapacity: z.number().min(1),
    batchIds: z.array(z.string()).min(1),
    prerequisiteCourseIds: z.array(z.string()).default([]),
});

export const listInstructorOfferingsInputSchema = z.object({
    page: z.number().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
    status: z.enum(offeringStatusEnum.enumValues).optional(),
});

export const getSemesterScheduleInputSchema = z.object({
    semesterId: z.string(),
});

export const approveEnrollmentInputSchema = z.object({
    enrollmentId: z.string(),
});
export const rejectEnrollmentInputSchema = approveEnrollmentInputSchema.extend({
    reason: z.string().min(3),
});
