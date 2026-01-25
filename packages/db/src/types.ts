import type {
    user,
    session,
    account,
    verification,
    twoFactor,
    auditLog,
    department,
    hod,
    program,
    advisor,
    batch,
    student,
    instructor,
    course,
    semester,
    courseOffering,
    courseOfferingInstructor,
    offeringBatch,
    enrollment,
    attendance,
    assessmentTemplate,
    assessment,
    grade,
    timeSlot,
    classroom,
    schedule,
    prerequisite,
    feedbackQuestion,
    courseFeedback,
    feedbackResponse,
    document,
} from "./schema";

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;

export type TwoFactor = typeof twoFactor.$inferSelect;
export type NewTwoFactor = typeof twoFactor.$inferInsert;

export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;

export type Department = typeof department.$inferSelect;
export type NewDepartment = typeof department.$inferInsert;

export type Hod = typeof hod.$inferSelect;
export type NewHod = typeof hod.$inferInsert;

export type Program = typeof program.$inferSelect;
export type NewProgram = typeof program.$inferInsert;

export type Advisor = typeof advisor.$inferSelect;
export type NewAdvisor = typeof advisor.$inferInsert;

export type Batch = typeof batch.$inferSelect;
export type NewBatch = typeof batch.$inferInsert;

export type Student = typeof student.$inferSelect;
export type NewStudent = typeof student.$inferInsert;

export type Instructor = typeof instructor.$inferSelect;
export type NewInstructor = typeof instructor.$inferInsert;

export type Course = typeof course.$inferSelect;
export type NewCourse = typeof course.$inferInsert;

export type Semester = typeof semester.$inferSelect;
export type NewSemester = typeof semester.$inferInsert;

export type CourseOffering = typeof courseOffering.$inferSelect;
export type NewCourseOffering = typeof courseOffering.$inferInsert;

export type CourseOfferingInstructor =
    typeof courseOfferingInstructor.$inferSelect;
export type NewCourseOfferingInstructor =
    typeof courseOfferingInstructor.$inferInsert;

export type OfferingBatch = typeof offeringBatch.$inferSelect;
export type NewOfferingBatch = typeof offeringBatch.$inferInsert;

export type Enrollment = typeof enrollment.$inferSelect;
export type NewEnrollment = typeof enrollment.$inferInsert;

export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;

export type AssessmentTemplate = typeof assessmentTemplate.$inferSelect;
export type NewAssessmentTemplate = typeof assessmentTemplate.$inferInsert;

export type Assessment = typeof assessment.$inferSelect;
export type NewAssessment = typeof assessment.$inferInsert;

export type Grade = typeof grade.$inferSelect;
export type NewGrade = typeof grade.$inferInsert;

export type TimeSlot = typeof timeSlot.$inferSelect;
export type NewTimeSlot = typeof timeSlot.$inferInsert;

export type Classroom = typeof classroom.$inferSelect;
export type NewClassroom = typeof classroom.$inferInsert;

export type Schedule = typeof schedule.$inferSelect;
export type NewSchedule = typeof schedule.$inferInsert;

export type Prerequisite = typeof prerequisite.$inferSelect;
export type NewPrerequisite = typeof prerequisite.$inferInsert;

export type FeedbackQuestion = typeof feedbackQuestion.$inferSelect;
export type NewFeedbackQuestion = typeof feedbackQuestion.$inferInsert;

export type CourseFeedback = typeof courseFeedback.$inferSelect;
export type NewCourseFeedback = typeof courseFeedback.$inferInsert;

export type FeedbackResponse = typeof feedbackResponse.$inferSelect;
export type NewFeedbackResponse = typeof feedbackResponse.$inferInsert;

export type Document = typeof document.$inferSelect;
export type NewDocument = typeof document.$inferInsert;

export type UserWithRelations = User & {
    student?: Student | null;
    instructor?: Instructor | null;
    hod?: Hod | null;
    advisor?: Advisor | null;
};

export type StudentWithRelations = Student & {
    user: User;
    batch: Batch & { program: Program };
    advisor: Advisor & { user: User };
    enrollments?: Enrollment[];
};

export type InstructorWithRelations = Instructor & {
    user: User;
    department: Department;
    offerings?: CourseOfferingInstructor[];
};

export type CourseOfferingWithRelations = CourseOffering & {
    course: Course;
    semester: Semester;
    instructors?: (CourseOfferingInstructor & {
        instructor: Instructor & { user: User };
    })[];
    batches?: (OfferingBatch & { batch: Batch })[];
    enrollments?: Enrollment[];
    assessmentTemplates?: AssessmentTemplate[];
    schedules?: Schedule[];
};

export type EnrollmentWithRelations = Enrollment & {
    student: Student & { user: User };
    offering: CourseOffering & { course: Course; semester: Semester };
    finalGrade?: Grade | null;
    assessments?: Assessment[];
    attendances?: Attendance[];
    feedback?: CourseFeedback | null;
};

export type CourseWithRelations = Course & {
    department: Department;
    prerequisites?: (Prerequisite & { prerequisiteCourse: Course })[];
    requiredBy?: (Prerequisite & { course: Course })[];
    offerings?: CourseOffering[];
};

export type ScheduleWithRelations = Schedule & {
    offering: CourseOffering & { course: Course };
    timeSlot: TimeSlot;
    classroom: Classroom;
};

export type CourseFeedbackWithRelations = CourseFeedback & {
    enrollment: Enrollment & {
        student: Student & { user: User };
        offering: CourseOffering & { course: Course };
    };
    responses?: (FeedbackResponse & { question: FeedbackQuestion })[];
};

export type UpdateUser = Partial<NewUser>;
export type UpdateSession = Partial<NewSession>;
export type UpdateAccount = Partial<NewAccount>;
export type UpdateVerification = Partial<NewVerification>;
export type UpdateTwoFactor = Partial<NewTwoFactor>;
export type UpdateAuditLog = Partial<NewAuditLog>;
export type UpdateDepartment = Partial<NewDepartment>;
export type UpdateHod = Partial<NewHod>;
export type UpdateProgram = Partial<NewProgram>;
export type UpdateAdvisor = Partial<NewAdvisor>;
export type UpdateBatch = Partial<NewBatch>;
export type UpdateStudent = Partial<NewStudent>;
export type UpdateInstructor = Partial<NewInstructor>;
export type UpdateCourse = Partial<NewCourse>;
export type UpdateSemester = Partial<NewSemester>;
export type UpdateCourseOffering = Partial<NewCourseOffering>;
export type UpdateCourseOfferingInstructor =
    Partial<NewCourseOfferingInstructor>;
export type UpdateOfferingBatch = Partial<NewOfferingBatch>;
export type UpdateEnrollment = Partial<NewEnrollment>;
export type UpdateAttendance = Partial<NewAttendance>;
export type UpdateAssessmentTemplate = Partial<NewAssessmentTemplate>;
export type UpdateAssessment = Partial<NewAssessment>;
export type UpdateGrade = Partial<NewGrade>;
export type UpdateTimeSlot = Partial<NewTimeSlot>;
export type UpdateClassroom = Partial<NewClassroom>;
export type UpdateSchedule = Partial<NewSchedule>;
export type UpdatePrerequisite = Partial<NewPrerequisite>;
export type UpdateFeedbackQuestion = Partial<NewFeedbackQuestion>;
export type UpdateCourseFeedback = Partial<NewCourseFeedback>;
export type UpdateFeedbackResponse = Partial<NewFeedbackResponse>;
export type UpdateDocument = Partial<NewDocument>;
