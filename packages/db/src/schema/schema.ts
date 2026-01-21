import { relations } from "drizzle-orm";
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
    bigint,
    check,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import {
    assessmentTypeEnum,
    attendanceStatusEnum,
    attendanceTypeEnum,
    auditActionEnum,
    auditEntityEnum,
    classroomTypeEnum,
    courseStatusEnum,
    courseTypeEnum,
    departmentCodeEnum,
    documentTypeEnum,
    enrollmentStatusEnum,
    enrollmentTypeEnum,
    instructorStatusEnum,
    offeringStatusEnum,
    programDegreeEnum,
    semesterEnum,
    semesterStatusEnum,
    studentStatusEnum,
    userRoleEnum,
} from "./enums";

export const user = pgTable(
    "user",
    {
        id: text("id").primaryKey(),
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
        twoFactorEnabled: boolean("two_factor_enabled").default(false),
        disabled: boolean("disabled").notNull().default(false),
    },
    (table) => [index("user_email_idx").on(table.email)]
);

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        impersonatedBy: text("impersonated_by"),
    },
    (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
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
        id: text("id").primaryKey(),
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
        id: text("id").primaryKey(),
        secret: text("secret").notNull().default(""),
        backupCodes: text("backup_codes").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [
        index("twoFactor_secret_idx").on(table.secret),
        index("twoFactor_userId_idx").on(table.userId),
    ]
);

export const rateLimit = pgTable("rate_limit", {
    id: text("id").primaryKey(),
    key: text("key"),
    count: integer("count"),
    lastRequest: bigint("last_request", { mode: "number" }),
});

export const auditLog = pgTable(
    "audit_log",
    {
        id: serial("id").primaryKey(),
        actorId: text("actor_id")
            .references(() => user.id, {
                onDelete: "set null",
            })
            .notNull(),
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
        id: text("id").primaryKey(),
        name: text("name").notNull(),
        code: departmentCodeEnum("code").notNull().unique(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [index("department_code_idx").on(table.code)]
);

export const program = pgTable(
    "program",
    {
        id: text("id").primaryKey(),
        name: text("name").notNull(),
        code: varchar("code", { length: 5 }).notNull().unique(),
        degree: programDegreeEnum("degree").notNull(),
        departmentId: text("department_id")
            .notNull()
            .references(() => department.id, { onDelete: "restrict" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("program_code_idx").on(table.code),
        index("program_dept_idx").on(table.departmentId),
        uniqueIndex("program_dept_name_degree_unique").on(
            table.departmentId,
            table.name,
            table.degree
        ),
        check(
            "program_code_uppercase_check",
            sql`${table.code} = upper(${table.code})`
        ),
    ]
);

export const batch = pgTable(
    "batch",
    {
        id: text("id").primaryKey(),
        year: integer("year").notNull(),
        programId: text("program_id").references(() => program.id, {
            onDelete: "set null",
        }),
        advisorId: text("advisor_id").references(() => user.id, {
            onDelete: "set null",
        }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("batch_program_idx").on(table.programId),
        index("batch_advisor_idx").on(table.advisorId),
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
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" })
            .unique(),
        rollNo: varchar("roll_no", { length: 12 }).notNull().unique(),
        batchId: text("batch_id")
            .notNull()
            .references(() => batch.id, { onDelete: "set null" }),
        cgpa: decimal("cgpa", { precision: 4, scale: 2 }).default("0.00"),
        status: studentStatusEnum("current_status").notNull(),
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
        check(
            "student_cgpa_range",
            sql`${table.cgpa} >= 0 AND ${table.cgpa} <= 10`
        ),
    ]
);

export const instructor = pgTable(
    "instructor",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" })
            .unique(),
        employeeId: varchar("employee_id", { length: 20 }).notNull().unique(),
        departmentId: text("department_id")
            .notNull()
            .references(() => department.id, { onDelete: "restrict" }),
        designation: varchar("designation", { length: 100 }),
        status: instructorStatusEnum("status").default("ACTIVE").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("instructor_user_idx").on(table.userId),
        index("instructor_employee_idx").on(table.employeeId),
        index("instructor_dept_idx").on(table.departmentId),
    ]
);

export const course = pgTable(
    "course",
    {
        id: text("id").primaryKey(),
        code: varchar("code", { length: 10 }).notNull().unique(),
        title: text("title").notNull(),
        credits: integer("credits").notNull().default(3),
        status: courseStatusEnum("status").notNull().default("PROPOSED"),
        type: courseTypeEnum("type").default("COMPOSITE").notNull(),
        departmentId: text("department_id")
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
            "course_credits_range",
            sql`${table.credits} > 0 AND ${table.credits} <= 12`
        ),
    ]
);

export const courseOffering = pgTable(
    "course_offering",
    {
        id: text("id").primaryKey(),
        courseId: text("course_id")
            .notNull()
            .references(() => course.id, { onDelete: "restrict" }),
        semesterId: text("semester_id")
            .notNull()
            .references(() => semester.id, { onDelete: "restrict" }),
        instructorId: text("instructor_id").references(() => instructor.id, {
            onDelete: "set null",
        }),
        maxCapacity: integer("max_capacity").notNull(),
        status: offeringStatusEnum("status").default("PROPOSED").notNull(),
        approvedBy: text("approved_by").references(() => user.id, {
            onDelete: "set null",
        }),
        approvedAt: timestamp("approved_at"),
        rejectionReason: text("rejection_reason"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (t) => [
        index("offering_course_idx").on(t.courseId),
        index("offering_semester_idx").on(t.semesterId),
        index("offering_instructor_idx").on(t.instructorId),
        index("offering_status_idx").on(t.status),
        uniqueIndex("offering_unique_course_semester").on(
            t.courseId,
            t.semesterId
        ),
        check("offering_capacity_positive", sql`${t.maxCapacity} > 0`),
    ]
);

export const offeringBatch = pgTable(
    "offering_batch",
    {
        id: text("id").primaryKey(),
        offeringId: text("offering_id")
            .notNull()
            .references(() => courseOffering.id, { onDelete: "cascade" }),
        batchId: text("batch_id")
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
        id: text("id").primaryKey(),
        studentId: text("student_id")
            .notNull()
            .references(() => student.id, { onDelete: "cascade" }),
        offeringId: text("offering_id")
            .notNull()
            .references(() => courseOffering.id, { onDelete: "cascade" }),
        status: enrollmentStatusEnum("status").default("PENDING").notNull(),
        type: enrollmentTypeEnum("type").notNull(),
        instructorApprovedAt: timestamp("instructor_approved_at"),
        advisorApprovedAt: timestamp("advisor_approved_at"),
        rejectedBy: text("rejected_by").references(() => user.id, {
            onDelete: "set null",
        }),
        rejectionReason: text("rejection_reason"),
        enrolledAt: timestamp("enrolled_at"),
        completedAt: timestamp("completed_at"),
        droppedAt: timestamp("dropped_at"),
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
        id: text("id").primaryKey(),
        enrollmentId: text("enrollment_id")
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
        uniqueIndex("attendance_unique").on(table.enrollmentId, table.date),
        index("attendance_enrollment_idx").on(table.enrollmentId),
        index("attendance_date_idx").on(table.date),
    ]
);

export const assessment = pgTable(
    "assessment",
    {
        id: text("id").primaryKey(),
        offeringId: text("offering_id")
            .notNull()
            .references(() => courseOffering.id, { onDelete: "cascade" }),
        title: text("title").notNull(),
        type: assessmentTypeEnum("type").notNull(),
        maxMarks: decimal("max_marks", { precision: 6, scale: 2 }).notNull(),
        weightage: decimal("weightage", { precision: 5, scale: 2 }).notNull(),
        dueDate: timestamp("due_date"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        uniqueIndex("assessment_unique").on(
            table.offeringId,
            table.type,
            table.title
        ),
        index("assessment_offering_idx").on(table.offeringId),
        index("assessment_type_idx").on(table.type),
        check("assessment_max_marks_positive", sql`${table.maxMarks} > 0`),
        check(
            "assessment_weightage_range",
            sql`${table.weightage} > 0 AND ${table.weightage} <= 100`
        ),
    ]
);

export const grade = pgTable(
    "grade",
    {
        id: text("id").primaryKey(),
        enrollmentId: text("enrollment_id")
            .notNull()
            .references(() => enrollment.id, { onDelete: "cascade" }),
        assessmentId: text("assessment_id")
            .notNull()
            .references(() => assessment.id, { onDelete: "cascade" }),
        marksObtained: decimal("marks_obtained", {
            precision: 6,
            scale: 2,
        }).notNull(),
        feedback: text("feedback"),
        gradedBy: text("graded_by").references(() => instructor.id, {
            onDelete: "set null",
        }),
        gradedAt: timestamp("graded_at"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("grade_enrollment_idx").on(table.enrollmentId),
        index("grade_assessment_idx").on(table.assessmentId),
        uniqueIndex("grade_unique_enrollment_assessment").on(
            table.enrollmentId,
            table.assessmentId
        ),
        check("grade_marks_non_negative", sql`${table.marksObtained} >= 0`),
    ]
);

export const timeSlot = pgTable(
    "time_slot",
    {
        id: text("id").primaryKey(),
        dayOfWeek: integer("day_of_week").notNull(),
        startTime: varchar("start_time", { length: 10 }).notNull(),
        endTime: varchar("end_time", { length: 10 }).notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        index("time_slot_day_idx").on(table.dayOfWeek),
        check(
            "time_slot_day_range",
            sql`${table.dayOfWeek} >= 0 AND ${table.dayOfWeek} <= 6`
        ),
    ]
);

export const classroom = pgTable(
    "classroom",
    {
        id: text("id").primaryKey(),
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
        id: text("id").primaryKey(),
        offeringId: text("offering_id")
            .notNull()
            .references(() => courseOffering.id, { onDelete: "cascade" }),
        timeSlotId: text("time_slot_id")
            .notNull()
            .references(() => timeSlot.id, { onDelete: "cascade" }),
        classroomId: text("classroom_id")
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
        id: text("id").primaryKey(),
        courseId: text("course_id")
            .notNull()
            .references(() => course.id, { onDelete: "cascade" }),
        prerequisiteCourseId: text("prerequisite_course_id")
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

export const courseFeedback = pgTable(
    "course_feedback",
    {
        id: text("id").primaryKey(),
        enrollmentId: text("enrollment_id")
            .notNull()
            .references(() => enrollment.id, { onDelete: "cascade" })
            .unique(),
        rating: integer("rating").notNull(),
        comments: text("comments"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("feedback_enrollment_idx").on(table.enrollmentId),
        index("feedback_rating_idx").on(table.rating),
        check(
            "feedback_rating_range_chk",
            sql`${table.rating} BETWEEN 1 AND 10`
        ),
    ]
);

export const semester = pgTable(
    "semester",
    {
        id: text("id").primaryKey(),
        year: integer("year").notNull(),
        name: varchar("name", { length: 50 }).notNull(),
        startDate: date("start_date", { mode: "date" }).notNull(),
        enrollmentDeadline: date("enrollment_deadline", {
            mode: "date",
        }).notNull(),
        endDate: date("end_date", { mode: "date" }).notNull(),
        semester: semesterEnum("semester").notNull(),
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
    ]
);

export const document = pgTable(
    "document",
    {
        id: uuid("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        key: text("key").notNull().unique(),
        type: documentTypeEnum("type").notNull(),
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
        uniqueIndex("user_profile_image_unique").on(table.userId, table.type),
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
    advisedBatches: many(batch),
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

export const departmentRelations = relations(department, ({ many }) => ({
    programs: many(program),
    courses: many(course),
    instructors: many(instructor),
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
    advisor: one(user, {
        fields: [batch.advisorId],
        references: [user.id],
    }),
    students: many(student),
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
    offerings: many(courseOffering),
    gradedAssessments: many(grade),
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
        instructor: one(instructor, {
            fields: [courseOffering.instructorId],
            references: [instructor.id],
        }),
        enrollments: many(enrollment),
        assessments: many(assessment),
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
    grades: many(grade),
    attendances: many(attendance),
    feedback: one(courseFeedback),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
    enrollment: one(enrollment, {
        fields: [attendance.enrollmentId],
        references: [enrollment.id],
    }),
}));

export const assessmentRelations = relations(assessment, ({ one, many }) => ({
    offering: one(courseOffering, {
        fields: [assessment.offeringId],
        references: [courseOffering.id],
    }),
    grades: many(grade),
}));

export const gradeRelations = relations(grade, ({ one }) => ({
    enrollment: one(enrollment, {
        fields: [grade.enrollmentId],
        references: [enrollment.id],
    }),
    assessment: one(assessment, {
        fields: [grade.assessmentId],
        references: [assessment.id],
    }),
    gradedByInstructor: one(instructor, {
        fields: [grade.gradedBy],
        references: [instructor.id],
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

export const courseFeedbackRelations = relations(courseFeedback, ({ one }) => ({
    enrollment: one(enrollment, {
        fields: [courseFeedback.enrollmentId],
        references: [enrollment.id],
    }),
}));

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
