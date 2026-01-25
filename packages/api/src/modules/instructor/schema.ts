import {
    assessmentTypeEnum,
    attendanceStatusEnum,
    attendanceTypeEnum,
    courseStatusEnum,
    enrollmentStatusEnum,
    gradeTypeEnum,
    offeringStatusEnum,
} from "@workspace/db";
import { z } from "zod";
import {
    LIST_DEFAULT_PAGE_SIZE,
    LIST_MAX_PAGE_SIZE,
    LIST_MIN_PAGE_SIZE,
} from "../constants";

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
    status: z.enum(enrollmentStatusEnum.enumValues).optional(),
    courseCode: z.string().optional(),
});

export const approveEnrollmentInputSchema = z.object({
    enrollmentId: z.string(),
});

export const rejectEnrollmentInputSchema = approveEnrollmentInputSchema.extend({
    reason: z.string().min(3),
});

const assessmentTemplateSchema = z.object({
    type: z.enum(assessmentTypeEnum.enumValues),
    maxMarks: z.number().positive(),
    weightage: z.number().min(1).max(100),
});

export const proposeOfferingInputSchema = z.object({
    courseId: z.string(),
    semesterId: z.string(),
    batchIds: z.array(z.string()).min(1),
    prerequisiteCourseIds: z.array(z.string().min(1)).default([]),
    instructorIds: z.array(z.string().min(1)).default([]),
    assessmentTemplates: z.array(assessmentTemplateSchema),
});

export const listInstructorOfferingsInputSchema = z.object({
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
    status: z.enum(offeringStatusEnum.enumValues).optional(),
});

export const proposeCourseInputSchema = z.object({
    code: z.string().min(3).max(10),
    title: z.string().min(3),
    description: z.any().optional(),
    lectureHours: z.number().min(0).default(3),
    tutorialHours: z.number().min(0).default(0),
    practicalHours: z.number().min(0).default(0),
    selfStudyHours: z.number().min(0).default(0),
    credits: z.number().min(0.5).max(5),
});

export const listInstructorCoursesInputSchema = z.object({
    status: z.enum(courseStatusEnum.enumValues).optional(),
});

export const uploadAssessmentMarksInputSchema = z.object({
    offeringId: z.string(),
    assessmentType: z.enum(assessmentTypeEnum.enumValues),
    marks: z
        .array(
            z.object({
                enrollmentId: z.string(),
                marksObtained: z.number().min(0),
            })
        )
        .min(1),
});

export const listAssessmentMarksInputSchema = z.object({
    offeringId: z.string(),
});

export const listFinalGradesInputSchema = z.object({
    offeringId: z.string(),
});

export const bulkAssignGradesInputSchema = z.object({
    offeringId: z.string(),
    grades: z
        .array(
            z.object({
                rollNo: z.string(),
                grade: z.enum(gradeTypeEnum.enumValues),
            })
        )
        .min(1),
});

export const listGradesInputSchema = z.object({
    offeringId: z.string(),
});

export const bulkAttendanceInput = z.object({
    offeringId: z.string(),
    date: z.date(),
    type: z.enum(attendanceTypeEnum.enumValues),
    records: z.array(
        z.object({
            rollNo: z.string(),
            status: z.enum(attendanceStatusEnum.enumValues),
            remarks: z.string().optional(),
        })
    ),
});

export const attendanceSummaryCursorInput = z.object({
    offeringId: z.string(),
    type: z.enum(attendanceTypeEnum.enumValues).optional(),
    cursor: z.string().optional(),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
});

export const getInstructorFeedbackResultsInputSchema = z.object({
    offeringId: z.string(),
});

export const getDescriptiveAnswersInputSchema = z.object({
    offeringId: z.string(),
    questionId: z.string(),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
    cursor: z.string().optional(),
});
