import { createTRPCRouter } from "@workspace/api/init";
import { studentProcedure } from "../middleware";
import {
    dropInputSchema,
    enrollInputSchema,
    getOfferingByIdInputSchema,
    listOfferingsInputSchema,
} from "../schema";
import {
    course,
    courseOffering,
    db,
    department,
    enrollment,
    logAuditEvent,
    offeringBatch,
    semester,
    student,
    assessmentTemplate,
    courseOfferingInstructor,
    instructor,
    user,
    batch,
    program,
} from "@workspace/db";
import { and, asc, eq, gt, ilike, inArray, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { MAX_CREDITS_PER_SEMESTER } from "../../constants";

export const offeringManagement = createTRPCRouter({
    list: studentProcedure
        .input(listOfferingsInputSchema)
        .query(async ({ input, ctx }) => {
            const studentUserId = ctx.session.user.id;
            const { pageSize, cursor, departmentCode, search } = input;

            const currentSemester = await db.query.semester.findFirst({
                where: (s, { eq }) => eq(s.status, "ONGOING"),
            });

            if (!currentSemester) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "No currently running semester",
                });
            }

            const studentRecord = await db.query.student.findFirst({
                where: eq(student.userId, studentUserId),
            });

            if (!studentRecord) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Student record not found",
                });
            }

            const filters = [
                eq(courseOffering.semesterId, currentSemester.id),
                eq(courseOffering.status, "ENROLLING"),
                eq(offeringBatch.batchId, studentRecord.batchId),
            ];

            if (cursor) {
                filters.push(gt(courseOffering.id, cursor));
            }

            if (departmentCode) {
                filters.push(eq(department.code, departmentCode.toUpperCase()));
            }

            if (search) {
                filters.push(
                    or(
                        ilike(course.code, `%${search}%`),
                        ilike(course.title, `%${search}%`)
                    )!
                );
            }

            const rows = await db
                .select({
                    offering: courseOffering,
                    course,
                    semester,
                    department,
                })
                .from(courseOffering)
                .innerJoin(course, eq(courseOffering.courseId, course.id))
                .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
                .innerJoin(department, eq(course.departmentId, department.id))
                .innerJoin(
                    offeringBatch,
                    eq(offeringBatch.offeringId, courseOffering.id)
                )
                .where(and(...filters))
                .orderBy(asc(courseOffering.id))
                .limit(pageSize + 1);

            const hasNextPage = rows.length > pageSize;
            const items = hasNextPage ? rows.slice(0, pageSize) : rows;

            const offeringIds = items.map((item) => item.offering.id);
            const enrollments = await db
                .select({
                    offeringId: enrollment.offeringId,
                    status: enrollment.status,
                })
                .from(enrollment)
                .where(
                    and(
                        eq(enrollment.studentId, studentRecord.id),
                        inArray(enrollment.offeringId, offeringIds)
                    )
                );

            const enrollmentMap = new Map(
                enrollments.map((e) => [e.offeringId, e.status])
            );

            const itemsWithEnrollment = items.map((item) => ({
                ...item,
                isEnrolled: enrollmentMap.has(item.offering.id),
                enrollmentStatus: enrollmentMap.get(item.offering.id) || null,
            }));

            const nextCursor = hasNextPage
                ? items[items.length - 1]!.offering.id
                : null;

            return {
                items: itemsWithEnrollment,
                nextCursor,
                hasNextPage,
            };
        }),

    enroll: studentProcedure
        .input(enrollInputSchema)
        .mutation(async ({ input, ctx }) => {
            const studentUserId = ctx.session.user.id;
            const { offeringId } = input;

            return db.transaction(async (tx) => {
                const studentRecord = await tx.query.student.findFirst({
                    where: eq(student.userId, studentUserId),
                });

                if (!studentRecord) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Student record not found",
                    });
                }

                const record = await tx
                    .select({
                        offering: courseOffering,
                        course,
                        semester,
                    })
                    .from(courseOffering)
                    .innerJoin(course, eq(courseOffering.courseId, course.id))
                    .innerJoin(
                        semester,
                        eq(courseOffering.semesterId, semester.id)
                    )
                    .where(eq(courseOffering.id, offeringId))
                    .then((r) => r[0]);

                if (!record) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Offering not found",
                    });
                }

                if (record.offering.status !== "ENROLLING") {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Offering is not open for enrollment",
                    });
                }

                if (new Date() > new Date(record.semester.enrollmentDeadline)) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Enrollment deadline has passed",
                    });
                }

                const currentCredits = await tx
                    .select({
                        total: sql<number>`COALESCE(SUM(${course.credits}), 0)`,
                    })
                    .from(enrollment)
                    .innerJoin(
                        courseOffering,
                        eq(enrollment.offeringId, courseOffering.id)
                    )
                    .innerJoin(course, eq(courseOffering.courseId, course.id))
                    .where(
                        and(
                            eq(enrollment.studentId, studentRecord.id),
                            eq(
                                courseOffering.semesterId,
                                record.offering.semesterId
                            ),
                            inArray(enrollment.status, [
                                "PENDING",
                                "INSTRUCTOR_APPROVED",
                                "ENROLLED",
                            ])
                        )
                    )
                    .then((r) => Number(r[0]?.total ?? 0));

                if (
                    currentCredits + record.course.credits >
                    MAX_CREDITS_PER_SEMESTER
                ) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Credit limit exceeded. Max allowed is ${MAX_CREDITS_PER_SEMESTER}`,
                    });
                }

                const [created] = await tx
                    .insert(enrollment)
                    .values({
                        studentId: studentRecord.id,
                        offeringId,
                        status: "PENDING",
                    })
                    .returning();

                if (!created) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to enroll",
                    });
                }

                await logAuditEvent({
                    userId: studentUserId,
                    action: "ENROLL",
                    entityType: "ENROLLMENT",
                    entityId: created.id,
                    after: created,
                });

                return created;
            });
        }),

    drop: studentProcedure
        .input(dropInputSchema)
        .mutation(async ({ input, ctx }) => {
            const studentUserId = ctx.session.user.id;
            const { offeringId } = input;

            const studentRecord = await db.query.student.findFirst({
                where: eq(student.userId, studentUserId),
            });

            if (!studentRecord) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Student record not found",
                });
            }

            const currentSemester = await db.query.semester.findFirst({
                where: (s, { eq }) => eq(s.status, "ONGOING"),
            });

            if (!currentSemester) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "No currently running semester",
                });
            }

            const enrollmentRecord = await db
                .select()
                .from(enrollment)
                .innerJoin(
                    courseOffering,
                    eq(enrollment.offeringId, courseOffering.id)
                )
                .where(
                    and(
                        eq(enrollment.studentId, studentRecord.id),
                        eq(enrollment.offeringId, offeringId),
                        eq(courseOffering.semesterId, currentSemester.id),
                        inArray(enrollment.status, [
                            "PENDING",
                            "INSTRUCTOR_APPROVED",
                            "ENROLLED",
                        ])
                    )
                )
                .then((rows) => rows[0]);

            if (!enrollmentRecord) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message:
                        "Enrollment not found for the given offering in the current semester",
                });
            }

            const [updated] = await db
                .update(enrollment)
                .set({
                    status: "DROPPED",
                    updatedAt: new Date(),
                })
                .where(eq(enrollment.id, enrollmentRecord.enrollment.id))
                .returning();

            if (!updated) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to drop the enrollment",
                });
            }

            await logAuditEvent({
                userId: studentUserId,
                action: "UNENROLL",
                entityType: "ENROLLMENT",
                entityId: updated.id,
                after: updated,
            });

            return updated;
        }),

    getById: studentProcedure
        .input(getOfferingByIdInputSchema)
        .query(async ({ input, ctx }) => {
            const { offeringId } = input;
            const studentUserId = ctx.session.user.id;

            const studentRecord = await db.query.student.findFirst({
                where: eq(student.userId, studentUserId),
            });

            if (!studentRecord) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Student record not found",
                });
            }

            const offeringData = await db
                .select({
                    offering: courseOffering,
                    course,
                    department,
                    semester,
                })
                .from(courseOffering)
                .innerJoin(course, eq(courseOffering.courseId, course.id))
                .innerJoin(department, eq(course.departmentId, department.id))
                .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
                .innerJoin(
                    offeringBatch,
                    eq(offeringBatch.offeringId, courseOffering.id)
                )
                .where(
                    and(
                        eq(courseOffering.id, offeringId),
                        eq(offeringBatch.batchId, studentRecord.batchId)
                    )
                )
                .then((rows) => rows[0]);

            if (!offeringData) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Offering not found",
                });
            }

            const enrollmentRecord = await db
                .select({
                    status: enrollment.status,
                })
                .from(enrollment)
                .where(
                    and(
                        eq(enrollment.offeringId, offeringId),
                        eq(enrollment.studentId, studentRecord.id)
                    )
                )
                .then((rows) => rows[0]);

            const instructors = await db
                .select({
                    id: instructor.id,
                    name: user.name,
                    email: user.email,
                    employeeId: instructor.employeeId,
                    isHead: courseOfferingInstructor.isHead,
                })
                .from(courseOfferingInstructor)
                .innerJoin(
                    instructor,
                    eq(courseOfferingInstructor.instructorId, instructor.id)
                )
                .innerJoin(user, eq(instructor.userId, user.id))
                .where(eq(courseOfferingInstructor.offeringId, offeringId));

            const batches = await db
                .select({
                    id: batch.id,
                    year: batch.year,
                    programName: program.name,
                    programCode: program.code,
                    degreeType: program.degreeType,
                })
                .from(offeringBatch)
                .innerJoin(batch, eq(offeringBatch.batchId, batch.id))
                .innerJoin(program, eq(batch.programId, program.id))
                .where(eq(offeringBatch.offeringId, offeringId));

            const assessments = await db
                .select({
                    id: assessmentTemplate.id,
                    type: assessmentTemplate.type,
                    maxMarks: assessmentTemplate.maxMarks,
                    weightage: assessmentTemplate.weightage,
                })
                .from(assessmentTemplate)
                .where(eq(assessmentTemplate.offeringId, offeringId));

            return {
                ...offeringData,
                instructors,
                batches,
                assessments,
                isEnrolled: !!enrollmentRecord,
                enrollmentStatus: enrollmentRecord?.status || null,
            };
        }),
});
