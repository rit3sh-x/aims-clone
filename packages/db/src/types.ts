import { InferSelectModel } from "drizzle-orm";
import {
    course,
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
    semester,
    courseOffering,
    courseOfferingInstructor,
    offeringBatch,
    enrollment,
    attendance,
    assessment,
    grade,
    timeSlot,
    classroom,
    schedule,
    prerequisite,
    courseFeedback,
    document,
} from "./schema";

export type User = InferSelectModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
export type Account = InferSelectModel<typeof account>;
export type Verification = InferSelectModel<typeof verification>;
export type TwoFactor = InferSelectModel<typeof twoFactor>;
export type AuditLog = InferSelectModel<typeof auditLog>;

export type Department = InferSelectModel<typeof department>;
export type HOD = InferSelectModel<typeof hod>;
export type Program = InferSelectModel<typeof program>;
export type Advisor = InferSelectModel<typeof advisor>;
export type Batch = InferSelectModel<typeof batch>;

export type Student = InferSelectModel<typeof student>;
export type Instructor = InferSelectModel<typeof instructor>;

export type Semester = InferSelectModel<typeof semester>;

export type Course = InferSelectModel<typeof course>;
export type CourseOffering = InferSelectModel<typeof courseOffering>;
export type CourseOfferingInstructor = InferSelectModel<
    typeof courseOfferingInstructor
>;
export type OfferingBatch = InferSelectModel<typeof offeringBatch>;

export type Enrollment = InferSelectModel<typeof enrollment>;
export type Attendance = InferSelectModel<typeof attendance>;

export type Assessment = InferSelectModel<typeof assessment>;
export type Grade = InferSelectModel<typeof grade>;

export type TimeSlot = InferSelectModel<typeof timeSlot>;
export type Classroom = InferSelectModel<typeof classroom>;
export type Schedule = InferSelectModel<typeof schedule>;

export type Prerequisite = InferSelectModel<typeof prerequisite>;
export type CourseFeedback = InferSelectModel<typeof courseFeedback>;

export type Document = InferSelectModel<typeof document>;
