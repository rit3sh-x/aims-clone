import { z } from "zod";
import {
    LIST_DEFAULT_PAGE_SIZE,
    LIST_MAX_PAGE_SIZE,
    LIST_MIN_PAGE_SIZE,
    MAX_POSSIBLE_QUESTIONS,
} from "../constants";
import { attendanceTypeEnum } from "@workspace/db";

export const listOfferingsInputSchema = z.object({
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
    cursor: z.string().optional(),
});

export const enrollInputSchema = z.object({
    offeringId: z.string(),
});

export const dropInputSchema = z.object({
    enrollmentId: z.string(),
});

export const listAttendanceInputSchema = z.object({
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(50).default(10),
    type: z.enum(attendanceTypeEnum.enumValues),
    weekStart: z.date().optional(),
});

export const submitFeedbackInputSchema = z.object({
    enrollmentId: z.string(),
    responses: z
        .array(
            z.object({
                questionId: z.string(),
                descriptiveAnswer: z.string().max(2000).optional(),
                yesNoAnswer: z.boolean().optional(),
                ratingAnswer: z.number().int().min(1).max(5).optional(),
            })
        )
        .min(1)
        .max(MAX_POSSIBLE_QUESTIONS),
});

export const getStudentFeedbackQuestionsInputSchema = z.object({
    enrollmentId: z.string(),
});
