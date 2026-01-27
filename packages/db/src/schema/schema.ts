import { relations, sql } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    boolean,
    index,
    serial,
    varchar,
    json,
    integer,
    decimal,
    date,
    check,
    uniqueIndex,
    uuid,
    real,
} from "drizzle-orm/pg-core";
import {
    assessmentTypeEnum,
    attendanceStatusEnum,
    attendanceTypeEnum,
    auditActionEnum,
    auditEntityEnum,
    classroomTypeEnum,
    courseStatusEnum,
    enrollmentStatusEnum,
    offeringStatusEnum,
    degreeTypeEnum,
    semesterTypeEnum,
    semesterStatusEnum,
    userRoleEnum,
    gradeTypeEnum,
    dayOfWeekEnum,
    sessionTypeEnum,
    theoryPeriodEnum,
    tutorialPeriodEnum,
    labPeriodEnum,
    feedbackQuestionTypeEnum,
} from "./enums";

export const user = pgTable(
    "user",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        name: text("name").notNull(),
        email: text("email").notNull().unique(),
        emailVerified: boolean("email_verified").default(false).notNull(),
        image: text("image"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
        role: userRoleEnum("role").notNull(),
        banned: boolean("banned").notNull().default(false),
        banReason: text("ban_reason"),
        banExpires: timestamp("ban_expires"),
        twoFactorEnabled: boolean("two_factor_enabled").default(true),
        disabled: boolean("disabled").notNull().default(false),
    },
    (table) => [index("user_email_idx").on(table.email)]
);

export const session = pgTable(
    "session",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: uuid("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        impersonatedBy: uuid("impersonated_by"),
    },
    (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
    "account",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: uuid("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
    "verification",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const twoFactor = pgTable(
    "two_factor",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        secret: text("secret").notNull().default(""),
        backupCodes: text("backup_codes").notNull(),
        userId: uuid("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [
        index("twoFactor_secret_idx").on(table.secret),
        index("twoFactor_userId_idx").on(table.userId),
    ]
);

export const auditLog = pgTable(
    "audit_log",
    {
        id: serial("id").primaryKey(),
        actorId: uuid("actor_id").references(() => user.id, {
            onDelete: "set null",
        }),
        action: auditActionEnum("action").notNull(),
        entityType: auditEntityEnum("entity_type").notNull(),
        entityId: text("entity_id"),
        before: json("before"),
        after: json("after"),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        index("audit_log_actor_idx").on(table.actorId),
        index("audit_log_entity_idx").on(table.entityType, table.entityId),
        index("audit_log_created_at_idx").on(table.createdAt),
        index("audit_log_action_idx").on(table.action),
    ]
);

export const department = pgTable(
    "department",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        name: text("name").notNull(),
        code: varchar("code", { length: 5 }).notNull().unique(),
        website: varchar("website", { length: 255 }).notNull().unique(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("department_code_idx").on(table.code),
        check(
            "department_code_uppercase",
            sql`${table.code} = UPPER(${table.code})`
        ),
    ]
);

export const hod = pgTable(
    "hod",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" })
            .unique(),
        phoneNumber: varchar("phone_number", { length: 16 }).notNull().unique(),
        website: varchar("website", { length: 255 }).notNull().unique(),
        employeeId: varchar("employee_id", { length: 20 }).notNull().unique(),
        departmentId: uuid("department_id")
            .notNull()
            .references(() => department.id, { onDelete: "restrict" })
            .unique(),
        appointedAt: timestamp("appointed_at").notNull().defaultNow(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("hod_user_idx").on(table.userId),
        index("hod_department_idx").on(table.departmentId),
    ]
);

export const program = pgTable(
    "program",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        name: text("name").notNull(),
        code: varchar("code", { length: 5 }).notNull(),
        degreeType: degreeTypeEnum("degree").notNull(),
        departmentId: uuid("department_id")
            .notNull()
            .references(() => department.id, { onDelete: "restrict" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        uniqueIndex("program_dept_code_unique").on(
            table.departmentId,
            table.code
        ),
        uniqueIndex("program_dept_name_unique").on(
            table.departmentId,
            table.name
        ),
        index("program_dept_idx").on(table.departmentId),
        check(
            "program_code_uppercase_check",
            sql`${table.code} = upper(${table.code})`
        ),
    ]
);

export const advisor = pgTable(
    "advisor",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" })
            .unique(),
        phoneNumber: varchar("phone_number", { length: 16 }).notNull().unique(),
        website: varchar("website", { length: 255 }).notNull().unique(),
        employeeId: varchar("employee_id", { length: 20 }).notNull().unique(),
        departmentId: uuid("department_id")
            .notNull()
            .references(() => department.id, { onDelete: "restrict" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("advisor_user_idx").on(table.userId),
        index("advisor_department_idx").on(table.departmentId),
    ]
);

export const batch = pgTable(
    "batch",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        year: integer("year").notNull(),
        programId: uuid("program_id")
            .notNull()
            .references(() => program.id, {
                onDelete: "restrict",
            }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("batch_program_idx").on(table.programId),
        index("batch_year_idx").on(table.year),
        uniqueIndex("batch_unique_year_program").on(
            table.year,
            table.programId
        ),
        check(
            "batch_year_valid",
            sql`${table.year} >= 2000 AND ${table.year} <= 2100`
        ),
    ]
);

export const student = pgTable(
    "student",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" })
            .unique(),
        rollNo: varchar("roll_no", { length: 12 }).notNull().unique(),
        batchId: uuid("batch_id")
            .notNull()
            .references(() => batch.id, { onDelete: "restrict" }),
        advisorId: uuid("advisor_id")
            .notNull()
            .references(() => advisor.id, { onDelete: "restrict" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("student_user_idx").on(table.userId),
        index("student_roll_no_idx").on(table.rollNo),
        index("student_batch_idx").on(table.batchId),
        index("student_advisor_idx").on(table.advisorId),
    ]
);

export const instructor = pgTable(
    "instructor",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" })
            .unique(),
        employeeId: varchar("employee_id", { length: 20 }).notNull().unique(),
        phoneNumber: varchar("phone_number", { length: 16 }).notNull().unique(),
        website: varchar("website", { length: 255 }).notNull().unique(),
        departmentId: uuid("department_id")
            .notNull()
            .references(() => department.id, { onDelete: "restrict" }),
        designation: varchar("designation", { length: 100 }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("instructor_user_idx").on(table.userId),
        index("instructor_dept_idx").on(table.departmentId),
        check(
            "instructor_phone_e164",
            sql`${table.phoneNumber} ~ '^\\+[1-9][0-9]{7,14}$'`
        ),
    ]
);

export const course = pgTable(
    "course",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        code: varchar("code", { length: 10 }).notNull().unique(),
        title: text("title").notNull(),
        lectureHours: integer("lecture_hours").notNull().default(3),
        tutorialHours: integer("tutorial_hours").notNull().default(0),
        practicalHours: integer("practical_hours").notNull().default(0),
        selfStudyHours: integer("self_study_hours").notNull().default(0),
        credits: real("credits").notNull().default(3),
        status: courseStatusEnum("status").notNull().default("PROPOSED"),
        departmentId: uuid("department_id")
            .notNull()
            .references(() => department.id, { onDelete: "restrict" }),
        description: json("description"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("course_code_idx").on(table.code),
        index("course_dept_idx").on(table.departmentId),
        check(
            "course_code_uppercase",
            sql`${table.code} = upper(${table.code})`
        ),
        check(
            "course_credits_range",
            sql`${table.credits} > 0 AND ${table.credits} <= 5`
        ),
        check(
            "course_credits_half_step",
            sql`${table.credits} * 2 = floor(${table.credits} * 2)`
        ),
    ]
);

export const semester = pgTable(
    "semester",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        year: integer("year").notNull(),
        startDate: date("start_date", { mode: "date" }).notNull(),
        enrollmentDeadline: date("enrollment_deadline", {
            mode: "date",
        }).notNull(),
        feedbackFormStartDate: date("feedback_form_start_date", {
            mode: "date",
        }).notNull(),
        endDate: date("end_date", { mode: "date" }).notNull(),
        semester: semesterTypeEnum("semester").notNull(),
        status: semesterStatusEnum("status").default("UPCOMING").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (t) => [
        uniqueIndex("semester_year_code_unique").on(t.year, t.semester),
        index("semester_status_idx").on(t.status),
        check("semester_date_range_chk", sql`${t.startDate} < ${t.endDate}`),
        check(
            "semester_enrollment_deadline_chk",
            sql`
                ${t.enrollmentDeadline} >= ${t.startDate}
                AND
                ${t.enrollmentDeadline} <= ${t.endDate}
            `
        ),
        check(
            "semester_feedback_date_range_chk",
            sql`${t.feedbackFormStartDate} < ${t.endDate}`
        ),
        check(
            "semester_feedback_after_start_chk",
            sql`${t.feedbackFormStartDate} > ${t.startDate}`
        ),
    ]
);

export const courseOffering = pgTable(
    "course_offering",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        courseId: uuid("course_id")
            .notNull()
            .references(() => course.id, { onDelete: "restrict" }),
        semesterId: uuid("semester_id")
            .notNull()
            .references(() => semester.id, { onDelete: "restrict" }),
        status: offeringStatusEnum("status").default("PROPOSED").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (t) => [
        index("offering_course_idx").on(t.courseId),
        index("offering_semester_idx").on(t.semesterId),
        index("offering_status_idx").on(t.status),
        uniqueIndex("offering_unique_course_semester").on(
            t.courseId,
            t.semesterId
        ),
    ]
);

export const courseOfferingInstructor = pgTable(
    "course_offering_instructor",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        offeringId: uuid("offering_id")
            .notNull()
            .references(() => courseOffering.id, { onDelete: "cascade" }),
        instructorId: uuid("instructor_id")
            .notNull()
            .references(() => instructor.id, { onDelete: "restrict" }),
        isHead: boolean("is_head").notNull().default(false),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (t) => [
        uniqueIndex("offering_instructor_unique").on(
            t.offeringId,
            t.instructorId
        ),
        index("offering_instructor_offering_idx").on(t.offeringId),
        index("offering_instructor_instructor_idx").on(t.instructorId),
        uniqueIndex("offering_single_head_unique")
            .on(t.offeringId)
            .where(sql`${t.isHead} = true`),
    ]
);

export const offeringBatch = pgTable(
    "offering_batch",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        offeringId: uuid("offering_id")
            .notNull()
            .references(() => courseOffering.id, { onDelete: "cascade" }),
        batchId: uuid("batch_id")
            .notNull()
            .references(() => batch.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (t) => [
        uniqueIndex("offering_batch_unique").on(t.offeringId, t.batchId),
        index("offering_batch_offering_idx").on(t.offeringId),
        index("offering_batch_batch_idx").on(t.batchId),
    ]
);

export const enrollment = pgTable(
    "enrollment",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        studentId: uuid("student_id")
            .notNull()
            .references(() => student.id, { onDelete: "cascade" }),
        offeringId: uuid("offering_id")
            .notNull()
            .references(() => courseOffering.id, { onDelete: "cascade" }),
        status: enrollmentStatusEnum("status").default("PENDING").notNull(),
        instructorApprovedAt: timestamp("instructor_approved_at"),
        advisorApprovedAt: timestamp("advisor_approved_at"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (t) => [
        index("enrollment_student_idx").on(t.studentId),
        index("enrollment_offering_idx").on(t.offeringId),
        index("enrollment_status_idx").on(t.status),
        uniqueIndex("enrollment_unique_student_offering").on(
            t.studentId,
            t.offeringId
        ),
    ]
);

export const attendance = pgTable(
    "attendance",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        enrollmentId: uuid("enrollment_id")
            .notNull()
            .references(() => enrollment.id, { onDelete: "cascade" }),
        date: date("date", { mode: "date" }).notNull(),
        status: attendanceStatusEnum("status").notNull(),
        type: attendanceTypeEnum("type").notNull(),
        remarks: text("remarks"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        uniqueIndex("attendance_unique").on(
            table.enrollmentId,
            table.date,
            table.type
        ),
        index("attendance_enrollment_idx").on(table.enrollmentId),
        index("attendance_date_idx").on(table.date),
    ]
);

export const assessmentTemplate = pgTable(
    "assessment_template",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        offeringId: uuid("offering_id")
            .notNull()
            .references(() => courseOffering.id, { onDelete: "cascade" }),
        type: assessmentTypeEnum("type").notNull(),
        maxMarks: real("max_marks").notNull(),
        weightage: real("weightage").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("assessment_template_offering_idx").on(table.offeringId),
        uniqueIndex("assessment_template_unique").on(
            table.offeringId,
            table.type
        ),
        check(
            "assessment_template_max_marks_positive",
            sql`${table.maxMarks} > 0`
        ),
        check(
            "assessment_template_weightage_range",
            sql`${table.weightage} > 0 AND ${table.weightage} <= 100`
        ),
    ]
);

export const assessment = pgTable(
    "assessment",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        enrollmentId: uuid("enrollment_id")
            .notNull()
            .references(() => enrollment.id, { onDelete: "cascade" }),
        templateId: uuid("template_id")
            .notNull()
            .references(() => assessmentTemplate.id, { onDelete: "restrict" }),
        marksObtained: real("marks_obtained").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("assessment_enrollment_idx").on(table.enrollmentId),
        index("assessment_template_idx").on(table.templateId),
        uniqueIndex("assessment_unique").on(
            table.enrollmentId,
            table.templateId
        ),
        check(
            "assessment_marks_range",
            sql`${table.marksObtained} IS NULL OR ${table.marksObtained} >= 0`
        ),
    ]
);

export const grade = pgTable(
    "grade",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        enrollmentId: uuid("enrollment_id")
            .notNull()
            .references(() => enrollment.id, { onDelete: "cascade" })
            .unique(),
        totalMarks: real("total_marks").notNull(),
        grade: gradeTypeEnum("grade").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("grade_enrollment_idx").on(table.enrollmentId),
        index("grade_grade_idx").on(table.grade),
        check("grade_total_marks_non_negative", sql`${table.totalMarks} >= 0`),
    ]
);

export const timeSlot = pgTable(
    "time_slot",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),
        sessionType: sessionTypeEnum("session_type").notNull(),
        theoryPeriod: theoryPeriodEnum("theory_period"),
        tutorialPeriod: tutorialPeriodEnum("tutorial_period"),
        labPeriod: labPeriodEnum("lab_period"),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("time_slot_day_idx").on(table.dayOfWeek),
        index("time_slot_type_idx").on(table.sessionType),
        check(
            "time_slot_session_period_check",
            sql`
                (
                    ${table.sessionType} = 'THEORY'
                    AND ${table.theoryPeriod} IS NOT NULL
                    AND ${table.tutorialPeriod} IS NULL
                    AND ${table.labPeriod} IS NULL
                )
                OR (
                    ${table.sessionType} = 'TUTORIAL'
                    AND ${table.tutorialPeriod} IS NOT NULL
                    AND ${table.theoryPeriod} IS NULL
                    AND ${table.labPeriod} IS NULL
                )
                OR (
                    ${table.sessionType} = 'LAB'
                    AND ${table.labPeriod} IS NOT NULL
                    AND ${table.theoryPeriod} IS NULL
                    AND ${table.tutorialPeriod} IS NULL
                )
            `
        ),
    ]
);

export const classroom = pgTable(
    "classroom",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        room: varchar("room_number", { length: 20 }).notNull().unique(),
        building: varchar("building", { length: 100 }),
        capacity: integer("capacity"),
        type: classroomTypeEnum("type").default("LECTURE").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("classroom_room_idx").on(table.room),
        check(
            "classroom_capacity_positive",
            sql`${table.capacity} IS NULL OR ${table.capacity} > 0`
        ),
    ]
);

export const schedule = pgTable(
    "schedule",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        offeringId: uuid("offering_id")
            .notNull()
            .references(() => courseOffering.id, { onDelete: "cascade" }),
        timeSlotId: uuid("time_slot_id")
            .notNull()
            .references(() => timeSlot.id, { onDelete: "cascade" }),
        classroomId: uuid("classroom_id")
            .notNull()
            .references(() => classroom.id, { onDelete: "restrict" }),
        effectiveFrom: date("effective_from", { mode: "date" }),
        effectiveTo: date("effective_to", { mode: "date" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        uniqueIndex("schedule_unique_room_slot").on(
            table.classroomId,
            table.timeSlotId
        ),
        uniqueIndex("schedule_unique_offering_slot").on(
            table.offeringId,
            table.timeSlotId
        ),
        index("schedule_offering_idx").on(table.offeringId),
        index("schedule_time_slot_idx").on(table.timeSlotId),
        index("schedule_classroom_idx").on(table.classroomId),
    ]
);

export const prerequisite = pgTable(
    "prerequisite",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        courseId: uuid("course_id")
            .notNull()
            .references(() => course.id, { onDelete: "cascade" }),
        prerequisiteCourseId: uuid("prerequisite_course_id")
            .notNull()
            .references(() => course.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("prerequisite_course_idx").on(table.courseId),
        uniqueIndex("prerequisite_unique").on(
            table.courseId,
            table.prerequisiteCourseId
        ),
        check(
            "prerequisite_not_self",
            sql`${table.courseId} <> ${table.prerequisiteCourseId}`
        ),
    ]
);

export const feedbackQuestion = pgTable(
    "feedback_question",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        questionText: text("question_text").notNull(),
        questionType: feedbackQuestionTypeEnum("question_type").notNull(),
        isRequired: boolean("is_required").notNull().default(true),
        order: integer("order").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        uniqueIndex("feedback_question_unique_order").on(table.order),
        check("feedback_question_order_positive", sql`${table.order} > 0`),
    ]
);

export const courseFeedback = pgTable(
    "course_feedback",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        enrollmentId: uuid("enrollment_id")
            .notNull()
            .references(() => enrollment.id, { onDelete: "cascade" })
            .unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("feedback_enrollment_idx").on(table.enrollmentId)]
);

export const feedbackResponse = pgTable(
    "feedback_response",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        feedbackId: uuid("feedback_id")
            .notNull()
            .references(() => courseFeedback.id, { onDelete: "cascade" }),
        questionId: uuid("question_id")
            .notNull()
            .references(() => feedbackQuestion.id, { onDelete: "restrict" }),
        descriptiveAnswer: text("descriptive_answer"),
        yesNoAnswer: boolean("yes_no_answer"),
        ratingAnswer: integer("rating_answer"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        uniqueIndex("feedback_response_unique").on(
            table.feedbackId,
            table.questionId
        ),
        index("feedback_response_feedback_idx").on(table.feedbackId),
        index("feedback_response_question_idx").on(table.questionId),
        check(
            "feedback_response_rating_range",
            sql`${table.ratingAnswer} IS NULL OR (${table.ratingAnswer} BETWEEN 1 AND 5)`
        ),
        check(
            "feedback_response_single_answer",
            sql`
                (
                    ${table.descriptiveAnswer} IS NOT NULL 
                    AND ${table.yesNoAnswer} IS NULL 
                    AND ${table.ratingAnswer} IS NULL
                )
                OR (
                    ${table.descriptiveAnswer} IS NULL 
                    AND ${table.yesNoAnswer} IS NOT NULL 
                    AND ${table.ratingAnswer} IS NULL
                )
                OR (
                    ${table.descriptiveAnswer} IS NULL 
                    AND ${table.yesNoAnswer} IS NULL 
                    AND ${table.ratingAnswer} IS NOT NULL
                )
            `
        ),
    ]
);

export const document = pgTable(
    "document",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        key: text("key").notNull().unique(),
        mimeType: varchar("mime_type", { length: 100 }).notNull(),
        size: integer("size").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("document_user_idx").on(table.userId),
        index("document_key_idx").on(table.key),
        index("document_created_idx").on(table.createdAt),
    ]
);

export const userRelations = relations(user, ({ many, one }) => ({
    sessions: many(session),
    accounts: many(account),
    twoFactors: many(twoFactor),
    student: one(student, {
        fields: [user.id],
        references: [student.userId],
    }),
    instructor: one(instructor, {
        fields: [user.id],
        references: [instructor.userId],
    }),
    hod: one(hod, {
        fields: [user.id],
        references: [hod.userId],
    }),
    advisor: one(advisor, {
        fields: [user.id],
        references: [advisor.userId],
    }),
    auditLogs: many(auditLog),
    documents: many(document),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
    user: one(user, {
        fields: [twoFactor.userId],
        references: [user.id],
    }),
}));

export const departmentRelations = relations(department, ({ many, one }) => ({
    programs: many(program),
    courses: many(course),
    instructors: many(instructor),
    advisors: many(advisor),
    hod: one(hod, {
        fields: [department.id],
        references: [hod.departmentId],
    }),
}));

export const hodRelations = relations(hod, ({ one }) => ({
    user: one(user, {
        fields: [hod.userId],
        references: [user.id],
    }),
    department: one(department, {
        fields: [hod.departmentId],
        references: [department.id],
    }),
}));

export const advisorRelations = relations(advisor, ({ one, many }) => ({
    user: one(user, {
        fields: [advisor.userId],
        references: [user.id],
    }),
    department: one(department, {
        fields: [advisor.departmentId],
        references: [department.id],
    }),
    students: many(student),
}));

export const programRelations = relations(program, ({ one, many }) => ({
    department: one(department, {
        fields: [program.departmentId],
        references: [department.id],
    }),
    batches: many(batch),
}));

export const batchRelations = relations(batch, ({ one, many }) => ({
    program: one(program, {
        fields: [batch.programId],
        references: [program.id],
    }),
    students: many(student),
    offeringBatches: many(offeringBatch),
}));

export const studentRelations = relations(student, ({ one, many }) => ({
    user: one(user, {
        fields: [student.userId],
        references: [user.id],
    }),
    batch: one(batch, {
        fields: [student.batchId],
        references: [batch.id],
    }),
    advisor: one(advisor, {
        fields: [student.advisorId],
        references: [advisor.id],
    }),
    enrollments: many(enrollment),
}));

export const instructorRelations = relations(instructor, ({ one, many }) => ({
    user: one(user, {
        fields: [instructor.userId],
        references: [user.id],
    }),
    department: one(department, {
        fields: [instructor.departmentId],
        references: [department.id],
    }),
    offerings: many(courseOfferingInstructor),
}));

export const courseRelations = relations(course, ({ one, many }) => ({
    department: one(department, {
        fields: [course.departmentId],
        references: [department.id],
    }),
    offerings: many(courseOffering),
    prerequisites: many(prerequisite, { relationName: "course" }),
    requiredBy: many(prerequisite, { relationName: "prerequisite" }),
}));

export const semesterRelations = relations(semester, ({ many }) => ({
    offerings: many(courseOffering),
}));

export const offeringBatchRelations = relations(offeringBatch, ({ one }) => ({
    offering: one(courseOffering, {
        fields: [offeringBatch.offeringId],
        references: [courseOffering.id],
    }),
    batch: one(batch, {
        fields: [offeringBatch.batchId],
        references: [batch.id],
    }),
}));

export const courseOfferingInstructorRelations = relations(
    courseOfferingInstructor,
    ({ one }) => ({
        offering: one(courseOffering, {
            fields: [courseOfferingInstructor.offeringId],
            references: [courseOffering.id],
        }),
        instructor: one(instructor, {
            fields: [courseOfferingInstructor.instructorId],
            references: [instructor.id],
        }),
    })
);

export const courseOfferingRelations = relations(
    courseOffering,
    ({ one, many }) => ({
        course: one(course, {
            fields: [courseOffering.courseId],
            references: [course.id],
        }),
        semester: one(semester, {
            fields: [courseOffering.semesterId],
            references: [semester.id],
        }),
        instructors: many(courseOfferingInstructor),
        enrollments: many(enrollment),
        assessmentTemplates: many(assessmentTemplate),
        schedules: many(schedule),
        batches: many(offeringBatch),
    })
);

export const enrollmentRelations = relations(enrollment, ({ one, many }) => ({
    student: one(student, {
        fields: [enrollment.studentId],
        references: [student.id],
    }),
    offering: one(courseOffering, {
        fields: [enrollment.offeringId],
        references: [courseOffering.id],
    }),
    finalGrade: one(grade, {
        fields: [enrollment.id],
        references: [grade.enrollmentId],
    }),
    assessments: many(assessment),
    attendances: many(attendance),
    feedback: one(courseFeedback, {
        fields: [enrollment.id],
        references: [courseFeedback.enrollmentId],
    }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
    enrollment: one(enrollment, {
        fields: [attendance.enrollmentId],
        references: [enrollment.id],
    }),
}));

export const assessmentTemplateRelations = relations(
    assessmentTemplate,
    ({ one, many }) => ({
        offering: one(courseOffering, {
            fields: [assessmentTemplate.offeringId],
            references: [courseOffering.id],
        }),
        assessments: many(assessment),
    })
);

export const assessmentRelations = relations(assessment, ({ one }) => ({
    template: one(assessmentTemplate, {
        fields: [assessment.templateId],
        references: [assessmentTemplate.id],
    }),
    enrollment: one(enrollment, {
        fields: [assessment.enrollmentId],
        references: [enrollment.id],
    }),
}));

export const gradeRelations = relations(grade, ({ one }) => ({
    enrollment: one(enrollment, {
        fields: [grade.enrollmentId],
        references: [enrollment.id],
    }),
}));

export const scheduleRelations = relations(schedule, ({ one }) => ({
    offering: one(courseOffering, {
        fields: [schedule.offeringId],
        references: [courseOffering.id],
    }),
    timeSlot: one(timeSlot, {
        fields: [schedule.timeSlotId],
        references: [timeSlot.id],
    }),
    classroom: one(classroom, {
        fields: [schedule.classroomId],
        references: [classroom.id],
    }),
}));

export const classroomRelations = relations(classroom, ({ many }) => ({
    schedules: many(schedule),
}));

export const timeSlotRelations = relations(timeSlot, ({ many }) => ({
    schedules: many(schedule),
}));

export const prerequisiteRelations = relations(prerequisite, ({ one }) => ({
    course: one(course, {
        fields: [prerequisite.courseId],
        references: [course.id],
        relationName: "course",
    }),
    prerequisiteCourse: one(course, {
        fields: [prerequisite.prerequisiteCourseId],
        references: [course.id],
        relationName: "prerequisite",
    }),
}));

export const feedbackQuestionRelations = relations(
    feedbackQuestion,
    ({ many }) => ({
        responses: many(feedbackResponse),
    })
);

export const courseFeedbackRelations = relations(
    courseFeedback,
    ({ one, many }) => ({
        enrollment: one(enrollment, {
            fields: [courseFeedback.enrollmentId],
            references: [enrollment.id],
        }),
        responses: many(feedbackResponse),
    })
);

export const feedbackResponseRelations = relations(
    feedbackResponse,
    ({ one }) => ({
        feedback: one(courseFeedback, {
            fields: [feedbackResponse.feedbackId],
            references: [courseFeedback.id],
        }),
        question: one(feedbackQuestion, {
            fields: [feedbackResponse.questionId],
            references: [feedbackQuestion.id],
        }),
    })
);

export const auditLogRelations = relations(auditLog, ({ one }) => ({
    user: one(user, {
        fields: [auditLog.actorId],
        references: [user.id],
    }),
}));

export const documentRelations = relations(document, ({ one }) => ({
    user: one(user, {
        fields: [document.userId],
        references: [user.id],
    }),
}));
