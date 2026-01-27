import { z } from "zod/v4";
import {
    auditActionEnum,
    auditEntityEnum,
    classroomTypeEnum,
    dayOfWeekEnum,
    feedbackQuestionTypeEnum,
    labPeriodEnum,
    semesterStatusEnum,
    semesterTypeEnum,
    sessionTypeEnum,
    theoryPeriodEnum,
    tutorialPeriodEnum,
} from "@workspace/db";
import {
    LIST_DEFAULT_PAGE_SIZE,
    LIST_MAX_PAGE_SIZE,
    LIST_MIN_PAGE_SIZE,
    MAX_POSSIBLE_QUESTIONS,
} from "../constants";

export const banUserInputSchema = z.object({
    id: z.string(),
    reason: z.string().optional(),
    expiresIn: z.number().int().positive().optional(),
});

export const unbanUserInputSchema = z.object({
    id: z.string(),
});

export const toggleDiableUserInputSchema = z.object({
    id: z.string(),
});

export const listUserSessionsInputSchema = z.object({
    id: z.string(),
});

export const revokeUserSessionInputSchema = z.object({
    sessionToken: z.string(),
});

export const revokeUserSessionsInputSchema = z.object({
    userId: z.string(),
});

export const listDepartmentsInputSchema = z.object({
    search: z.string().optional(),
});

export const listDepartmentFacultyInputSchema = z.object({
    departmentId: z.string().optional(),
    search: z.preprocess((val) => {
        if (typeof val === "string") {
            const trimmed = val.trim();
            return trimmed === "" ? undefined : trimmed;
        }
        return val;
    }, z.string().min(1).optional()),
    cursor: z
        .object({
            createdAt: z.date(),
            id: z.string(),
        })
        .optional(),
    pageSize: z.number().min(1).max(50).default(20),
});

export const getDepartmentByIdInputSchema = z.object({
    id: z.string(),
});

export const listProgramsInputSchema = z.object({
    departmentId: z.string().optional(),
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

export const listBatchesInputSchema = z.object({
    departmentCode: z.string().optional(),
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

export const listStudentsInputSchema = z.object({
    search: z.string().optional(),
    departmentCode: z.string().optional(),
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

export const listInstructorsInputSchema = z.object({
    departmentCode: z.string().optional(),
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
    courseId: z.string().optional(),
    semesterYear: z.number().optional(),
    semesterTerm: z.enum(semesterTypeEnum.enumValues).optional(),
    instructorIds: z.array(z.string()).optional(),
    departmentCode: z.string().optional(),
});

export const listAdvisorsInputSchema = z.object({
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
    departmentCode: z.string().length(5).toUpperCase().optional(),
    search: z.string().min(1).optional(),
});

export const getAdvisorByIdInputSchema = z.object({
    id: z.string(),
});

export const listHodsInputSchema = z.object({
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
    departmentCode: z.string().min(1).toUpperCase().optional(),
    search: z.string().min(1).optional(),
});

export const getHodByIdInputSchema = z.object({
    id: z.string(),
});

export const acceptCourseInputSchema = z.object({
    courseId: z.string(),
});

export const rejectCourseInputSchema = acceptCourseInputSchema.extend({
    reason: z.string().min(3).optional(),
});

export const listCourseInputSchema = z.object({
    departmentCode: z.string().optional(),
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

export const getCourseByIdSchema = z.object({
    id: z.string(),
});

export const listSemestersInputSchema = z.object({
    status: z.enum(semesterStatusEnum.enumValues).optional(),
    semester: z.enum(semesterTypeEnum.enumValues).optional(),
    year: z.number().optional(),
    cursor: z
        .object({
            year: z.number(),
            startDate: z.date(),
            id: z.string(),
        })
        .optional(),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
});

export const createSemesterInputSchema = z.object({
    year: z.number(),
    semester: z.enum(semesterTypeEnum.enumValues),
    startDate: z.date(),
    endDate: z.date(),
    enrollmentDeadline: z.date(),
    feedbackFormStartDate: z.date(),
});

export const startSemesterInputSchema = z.object({ id: z.string() });
export const endSemesterInputSchema = startSemesterInputSchema;

export const updateSemesterInputSchema = createSemesterInputSchema
    .partial()
    .extend({
        id: z.string(),
    });

export const classroomListInputSchema = z.object({
    type: z.enum(classroomTypeEnum.enumValues).optional(),
    search: z.string().optional(),
    cursor: z
        .object({
            room: z.string(),
            id: z.string(),
        })
        .optional(),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
});

export const listLogsInputSchema = z.object({
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
    cursor: z
        .object({
            createdAt: z.date(),
            id: z.number(),
        })
        .optional(),
    action: z.enum(auditActionEnum.enumValues).optional(),
    entityType: z.enum(auditEntityEnum.enumValues).optional(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
});

const scheduleInputSchema = z
    .discriminatedUnion("sessionType", [
        z.object({
            courseCode: z.string().min(1, "Course code is required"),
            roomCode: z.string().min(1, "Room code is required"),
            dayOfWeek: dayOfWeekEnum,
            sessionType: z.literal("THEORY"),
            period: theoryPeriodEnum,
            effectiveFrom: z.date().optional(),
            effectiveTo: z.date().optional(),
        }),
        z.object({
            courseCode: z.string().min(1, "Course code is required"),
            roomCode: z.string().min(1, "Room code is required"),
            dayOfWeek: dayOfWeekEnum,
            sessionType: z.literal("TUTORIAL"),
            period: tutorialPeriodEnum,
            effectiveFrom: z.date().optional(),
            effectiveTo: z.date().optional(),
        }),
        z.object({
            courseCode: z.string().min(1, "Course code is required"),
            roomCode: z.string().min(1, "Room code is required"),
            dayOfWeek: dayOfWeekEnum,
            sessionType: z.literal("LAB"),
            period: labPeriodEnum,
            effectiveFrom: z.date().optional(),
            effectiveTo: z.date().optional(),
        }),
    ])
    .refine(
        (data) => {
            if (data.effectiveFrom && data.effectiveTo) {
                return data.effectiveFrom < data.effectiveTo;
            }
            return true;
        },
        {
            message: "effectiveFrom must be before effectiveTo",
            path: ["effectiveFrom"],
        }
    );

export const createBulkSchedulesInputSchema = z.object({
    schedules: z
        .array(scheduleInputSchema)
        .min(1, "At least one schedule is required"),
});

export const createFeedbackQuestionsInputSchema = z.object({
    questions: z
        .array(
            z.object({
                questionText: z.string().min(1).max(500),
                questionType: z.enum(feedbackQuestionTypeEnum.enumValues),
                isRequired: z.boolean().default(true),
                order: z.number().int().positive(),
            })
        )
        .min(1)
        .max(MAX_POSSIBLE_QUESTIONS),
});

export const updateFeedbackQuestionInputSchema = z.object({
    id: z.string(),
    questionText: z.string().min(1).max(500).optional(),
    questionType: z.enum(feedbackQuestionTypeEnum.enumValues).optional(),
    isRequired: z.boolean().optional(),
    order: z.number().int().positive().optional(),
});

export const deleteFeedbackQuestionsInputSchema = z.object({
    ids: z
        .array(z.string())
        .min(1, "At least one question ID is required")
        .max(
            MAX_POSSIBLE_QUESTIONS,
            `Cannot delete more than ${MAX_POSSIBLE_QUESTIONS} questions at once`
        ),
});

export const reorderFeedbackQuestionsInputSchema = z.object({
    questions: z
        .array(
            z.object({
                id: z.string(),
                order: z.number().int().positive().max(MAX_POSSIBLE_QUESTIONS),
            })
        )
        .min(1)
        .max(MAX_POSSIBLE_QUESTIONS),
});

export const enrollmentChartDataInputSchema = z.object({
    days: z.number().max(100).min(1),
});
