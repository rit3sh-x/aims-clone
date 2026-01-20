import { z } from "zod";
import {
    auditActionEnum,
    auditEntityEnum,
    classroomTypeEnum,
    courseStatusEnum,
    courseTypeEnum,
    departmentCodeEnum,
    instructorStatusEnum,
    offeringStatusEnum,
    programDegreeEnum,
    semesterEnum,
    semesterStatusEnum,
    studentStatusEnum,
    userRoleEnum,
} from "@workspace/db";
import {
    DEFAULT_PAGE,
    LIST_DEFAULT_PAGE_SIZE,
    LIST_MAX_PAGE_SIZE,
    LIST_MIN_PAGE_SIZE,
} from "../constants";

export const createUserInputSchema = z.object({
    email: z.email(),
    name: z.string().min(1),
    role: z.enum(userRoleEnum.enumValues),
});

export const createUserOutputSchema = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    role: z.enum(userRoleEnum.enumValues),
    image: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const updateUserInputSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    email: z.email().optional(),
    role: z.enum(userRoleEnum.enumValues).optional(),
    disabled: z.boolean().optional(),
});

export const updateUserOutputSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    role: z.enum(userRoleEnum.enumValues),
    disabled: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    banned: z.boolean(),
    banReason: z.string().nullable(),
    banExpires: z.date().nullable(),
    image: z.string().nullable(),
});

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
    id: z.string().min(1),
});

export const revokeUserSessionInputSchema = z.object({
    sessionToken: z.string().min(1),
});

export const revokeUserSessionsInputSchema = z.object({
    userId: z.string().min(1),
});

export const listDepartmentsInputSchema = z.object({
    search: z.string().optional(),
});

export const listDepartmentsOutputSchema = z.array(
    z.object({
        id: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        name: z.string(),
        code: z.enum(departmentCodeEnum.enumValues),
    })
);

export const getDepartmentByIdInputSchema = z.object({
    id: z.string(),
});

export const updateDepartmentInputSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
});

export const listProgramsInputSchema = z.object({
    departmentId: z.string().optional(),
    search: z.string().optional(),
    page: z.number().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
});

export const createProgramSchema = z.object({
    name: z.string(),
    code: z.string().max(5),
    degree: z.enum(programDegreeEnum.enumValues),
    departmentId: z.string(),
});

export const updateProgramSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string().max(5),
    degree: z.enum(programDegreeEnum.enumValues),
    departmentId: z.string(),
});

export const deleteProgramSchema = z.object({ id: z.string() });

export const listBatchesInputSchema = z.object({
    programId: z.string().optional(),
    year: z.number().optional(),
    page: z.number().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
});

export const createBatchInputSchema = z.object({
    year: z.number().min(2000).max(2100),
    programCode: z.string(),
    advisorId: z.string().optional(),
});

export const updateBatchInputSchema = createBatchInputSchema
    .extend({
        id: z.string(),
        programId: z.string(),
    })
    .omit({
        programCode: true,
    });

export const deleteBatchSchema = z.object({ id: z.string() });

export const listStudentsInputSchema = z.object({
    page: z.number().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
    search: z.string().optional(),
    status: z.enum(studentStatusEnum.enumValues).optional(),
    departmentCode: z.enum(departmentCodeEnum.enumValues).optional(),
    programCode: z.enum(programDegreeEnum.enumValues).optional(),
    year: z.number().min(2000).max(2100).optional(),
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
        status: z.enum(studentStatusEnum.enumValues),
        cgpa: z.string().optional(),
    })
);

export const updateStudentInputSchema = z.object({
    id: z.string(),
    rollNo: z.string().max(12).optional(),
    batchId: z.string().optional(),
    cgpa: z.string().optional(),
    status: z.enum(studentStatusEnum.enumValues).optional(),
});

export const disableStudentInputSchema = z.object({ studentId: z.string() });

export const listInstructorsInputSchema = z.object({
    page: z.number().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
    departmentCode: z.enum(departmentCodeEnum.enumValues).optional(),
    status: z.enum(instructorStatusEnum.enumValues).optional(),
    search: z.string().optional(),
});

export const createInstructorInputSchema = z.object({
    employeeId: z.string().max(20),
    email: z.email(),
    name: z.string().min(1),
    departmentCode: z.enum(departmentCodeEnum.enumValues),
    designation: z.string().max(100).optional(),
    status: z.enum(instructorStatusEnum.enumValues).default("ACTIVE"),
});

export const updateInstructorInputSchema = createInstructorInputSchema
    .extend({
        id: z.string(),
    })
    .omit({
        employeeId: true,
    });

export const acceptCourseOfferingInputSchema = z.object({
    offeringId: z.string(),
});

export const rejectCourseOfferingInputSchema =
    acceptCourseOfferingInputSchema.extend({
        reason: z.string().min(3),
    });

export const acceptCourseInputSchema = z.object({
    courseId: z.string(),
});

export const rejectCourseInputSchema = acceptCourseInputSchema.extend({
    reason: z.string().min(3),
});

export const listCourseInputSchema = z.object({
    page: z.number().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
    departmentCode: z.enum(departmentCodeEnum.enumValues).optional(),
    type: z.enum(courseTypeEnum.enumValues).optional(),
    status: z.enum(courseStatusEnum.enumValues).optional(),
    search: z.string().optional(),
});

export const getCourseByIdSchema = z.object({
    id: z.string(),
});

export const listSemestersInputSchema = z.object({
    status: z.enum(semesterStatusEnum.enumValues).optional(),
    semester: z.enum(semesterEnum.enumValues).optional(),
    year: z.number().optional(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
});

export const createSemesterInputSchema = z.object({
    year: z.number(),
    semester: z.enum(semesterEnum.enumValues),
    name: z.string().max(50),
    startDate: z.date(),
    endDate: z.date(),
    enrollmentDeadline: z.date(),
});

export const startSemesterInputSchema = z.object({ id: z.string() });
export const endSemesterInputSchema = startSemesterInputSchema;

export const updateSemesterInputSchema = z.object({
    id: z.string(),
    name: z.string().max(50).optional(),
    semester: z.enum(semesterEnum.enumValues).optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
});

export const listOfferingsInputSchema = z.object({
    page: z.number().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
    courseCode: z.string().optional(),
    semesterYear: z.number().optional(),
    semesterTerm: z.enum(semesterEnum.enumValues).optional(),
    instructorId: z.string().optional(),
    departmentCode: z.enum(departmentCodeEnum.enumValues).optional(),
    status: z.enum(offeringStatusEnum.enumValues).optional(),
});

export const classroomListInputSchema = z.object({
    page: z.number().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
    type: z.enum(classroomTypeEnum.enumValues).optional(),
    search: z.string().optional(),
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
        id: z.string(),
    });

export const deleteClassroomInputSchema = z.object({ id: z.string() });

export const listLogsInputSchema = z.object({
    page: z.number().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
    actorId: z.string().optional(),
    action: z.enum(auditActionEnum.enumValues).optional(),
    entityType: z.enum(auditEntityEnum.enumValues).optional(),
    entityId: z.string().optional(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
});
