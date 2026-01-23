import { z } from "zod";
import {
    auditActionEnum,
    auditEntityEnum,
    classroomTypeEnum,
    courseStatusEnum,
    degreeTypeEnum,
    semesterStatusEnum,
    semesterTypeEnum,
} from "@workspace/db";
import {
    LIST_DEFAULT_PAGE_SIZE,
    LIST_MAX_PAGE_SIZE,
    LIST_MIN_PAGE_SIZE,
} from "../constants";

export const banUserInputSchema = z.object({
    id: z.string(),
    reason: z.string(),
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
    search: z.string().min(1).optional(),
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

export const updateDepartmentInputSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    code: z.string().optional(),
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

export const createProgramSchema = z.object({
    name: z.string(),
    code: z.string().max(5),
    degreeType: z.enum(degreeTypeEnum.enumValues),
    departmentId: z.string(),
});

export const updateProgramSchema = createProgramSchema.partial().extend({
    id: z.string(),
});

export const deleteProgramSchema = z.object({ id: z.string() });

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

export const createBatchInputSchema = z.object({
    year: z.number().min(2000).max(2100),
    programId: z.string(),
    advisorId: z.string(),
});

export const updateBatchInputSchema = createBatchInputSchema.partial().extend({
    id: z.string(),
});

export const deleteBatchSchema = z.object({ id: z.string() });

export const listStudentsInputSchema = z.object({
    search: z.string().optional(),
    departmentCode: z.string().optional(),
    programCode: z.string().optional(),
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

export const createManyStudentsInputSchema = z.array(
    z.object({
        email: z.email(),
        name: z.string().min(1),
        rollNo: z.string().max(12),
        programCode: z.string().min(1),
        year: z.number().min(2000).max(2100),
        cgpa: z.string().optional(),
    })
);

export const updateStudentInputSchema = createManyStudentsInputSchema.element
    .partial()
    .extend({
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

export const createInstructorInputSchema = z.object({
    email: z.email(),
    name: z.string().min(1),
    departmentCode: z.string(),
    designation: z.string().max(100).optional(),
});

export const updateInstructorInputSchema = createInstructorInputSchema
    .partial()
    .extend({
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

export const createAdvisorInputSchema = z.object({
    name: z.string().min(1).max(255),
    email: z.email(),
    departmentCode: z.string().length(5).toUpperCase(),
});

export const updateAdvisorInputSchema = createAdvisorInputSchema
    .partial()
    .extend({
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
    departmentCode: z.string().length(5).toUpperCase().optional(),
    search: z.string().min(1).optional(),
});

export const getHodByIdInputSchema = z.object({
    id: z.string(),
});

export const createHodInputSchema = z.object({
    name: z.string().min(1).max(255),
    email: z.email(),
    departmentCode: z.string().length(5).toUpperCase(),
});

export const updateHodInputSchema = createHodInputSchema.partial().extend({
    id: z.string(),
});

export const acceptCourseInputSchema = z.object({
    courseId: z.string(),
});

export const rejectCourseInputSchema = acceptCourseInputSchema.extend({
    reason: z.string().min(3),
});

export const listCourseInputSchema = z.object({
    departmentCode: z.string().optional(),
    status: z.enum(courseStatusEnum.enumValues).optional(),
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

export const createClassroomInputSchema = z.object({
    room: z.string().max(20),
    building: z.string().max(100).optional(),
    capacity: z.number().min(1).optional(),
    type: z.enum(classroomTypeEnum.enumValues),
});

export const updateClassroomInputSchema = createClassroomInputSchema
    .partial()
    .extend({
        roomCode: z.string(),
    });

export const deleteClassroomInputSchema = z.object({ roomCode: z.string() });

export const listLogsInputSchema = z.object({
    pageSize: z.number().min(1).max(100).default(20),
    cursor: z
        .object({
            createdAt: z.date(),
            id: z.number(),
        })
        .optional(),
    actorId: z.string().optional(),
    action: z.enum(auditActionEnum.enumValues).optional(),
    entityType: z.enum(auditEntityEnum.enumValues).optional(),
    entityId: z.string().optional(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
});

export const listSchedulesInputSchema = z.object({
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
    offeringId: z.string().optional(),
    roomCode: z.string().optional(),
    dayOfWeek: z.number().min(0).max(6).optional(),
});

export const getScheduleByIdInputSchema = z.object({
    id: z.string(),
});

export const createManySchedulesInputSchema = z.object({
    schedules: z
        .array(
            z.object({
                offeringId: z.string(),
                roomCode: z.string(),
                timeSlotId: z.string(),
                effectiveFrom: z.date().optional(),
                effectiveTo: z.date().optional(),
            })
        )
        .min(1)
        .max(100),
});

export const createScheduleInputSchema = z.object({
    offeringId: z.string(),
    roomCode: z.string(),
    timeSlotId: z.string(),
    effectiveFrom: z.date().optional(),
    effectiveTo: z.date().optional(),
});

export const updateScheduleInputSchema = z.object({
    id: z.string(),
    offeringId: z.string().optional(),
    roomCode: z.string().optional(),
    timeSlotId: z.string().optional(),
    effectiveFrom: z.date().nullable().optional(),
    effectiveTo: z.date().nullable().optional(),
});

export const deleteScheduleInputSchema = z.object({
    id: z.string(),
});

export const listTimeSlotsInputSchema = z.object({
    dayOfWeek: z.number().min(0).max(6).optional(),
});

export const createTimeSlotInputSchema = z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "Invalid time format. Use HH:MM (24-hour format)",
    }),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "Invalid time format. Use HH:MM (24-hour format)",
    }),
});

export const deleteTimeSlotInputSchema = z.object({
    id: z.string(),
});
