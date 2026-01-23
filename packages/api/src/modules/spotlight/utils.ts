import {
    db,
    user,
    course,
    instructor,
    student,
    batch,
    program,
    department,
    courseOffering,
    courseOfferingInstructor,
    enrollment,
    semester,
    advisor,
    hod,
} from "@workspace/db";
import { SpotlightResult } from "./schema";
import { sql, and, eq, or, ilike, getTableColumns } from "drizzle-orm";
import type { Semester } from "@workspace/db";

const searchPattern = (query: string) => `%${query}%`;

export async function searchForAdmin(query: string, results: SpotlightResult) {
    const pattern = searchPattern(query);

    const courses = await db
        .select(getTableColumns(course))
        .from(course)
        .where(or(ilike(course.code, pattern), ilike(course.title, pattern)))
        .limit(3);

    if (courses.length > 0) {
        results.push({
            title: "Courses",
            items: courses.map((c) => ({
                field: `${c.code} - ${c.title}`,
                url: "/courses",
                param: c.id,
            })),
        });
    }

    const instructors = await db
        .select({
            id: instructor.id,
            user: user,
            department: department,
        })
        .from(instructor)
        .innerJoin(user, eq(instructor.userId, user.id))
        .leftJoin(department, eq(instructor.departmentId, department.id))
        .where(or(ilike(user.name, pattern), ilike(user.email, pattern)))
        .limit(3);

    if (instructors.length > 0) {
        results.push({
            title: "Instructors",
            items: instructors.map((i) => ({
                field: i.user.name,
                url: "/instructors/",
                param: i.id,
            })),
        });
    }

    const students = await db
        .select({
            id: student.id,
            rollNo: student.rollNo,
            user: user,
            batch: batch,
            program: program,
        })
        .from(student)
        .innerJoin(user, eq(student.userId, user.id))
        .leftJoin(batch, eq(student.batchId, batch.id))
        .leftJoin(program, eq(batch.programId, program.id))
        .where(or(ilike(student.rollNo, pattern), ilike(user.name, pattern)))
        .limit(3);

    if (students.length > 0) {
        results.push({
            title: "Students",
            items: students.map((s) => ({
                field: `${s.rollNo} - ${s.user.name}`,
                url: "/students",
                param: s.id,
            })),
        });
    }

    const departments = await db
        .select(getTableColumns(department))
        .from(department)
        .where(
            or(ilike(department.name, pattern), ilike(department.code, pattern))
        )
        .limit(3);

    if (departments.length > 0) {
        results.push({
            title: "Departments",
            items: departments.map((d) => ({
                field: `${d.code} - ${d.name}`,
                url: "/departments",
                param: d.id,
            })),
        });
    }

    const programs = await db
        .select(getTableColumns(program))
        .from(program)
        .where(or(ilike(program.name, pattern), ilike(program.code, pattern)))
        .limit(3);

    if (programs.length > 0) {
        results.push({
            title: "Programs",
            items: programs.map((p) => ({
                field: `${p.code} - ${p.name}`,
                url: "/programs",
                param: p.id,
            })),
        });
    }

    const batches = await db
        .select({
            id: batch.id,
            year: batch.year,
            program: program,
        })
        .from(batch)
        .leftJoin(program, eq(batch.programId, program.id))
        .where(
            or(
                sql`CAST(${batch.year} AS TEXT) ILIKE ${pattern}`,
                ilike(program.name, pattern),
                ilike(program.code, pattern)
            )
        )
        .limit(3);

    if (batches.length > 0) {
        results.push({
            title: "Batches",
            items: batches.map((b) => ({
                field: `${b.program?.name || "Unknown"} - ${b.year}`,
                url: "/batches",
                param: b.id,
            })),
        });
    }
}

export async function searchForHod(
    query: string,
    results: SpotlightResult,
    userId: string
) {
    const currentHod = await db.query.hod.findFirst({
        where: eq(hod.userId, userId),
        with: { department: true },
    });
    if (!currentHod) return;

    const pattern = searchPattern(query);

    const deptInstructors = await db
        .select({
            id: instructor.id,
            user: user,
        })
        .from(instructor)
        .innerJoin(user, eq(instructor.userId, user.id))
        .where(
            and(
                eq(instructor.departmentId, currentHod.departmentId),
                or(ilike(user.name, pattern), ilike(user.email, pattern))
            )
        )
        .limit(3);

    if (deptInstructors.length > 0) {
        results.push({
            title: "Department Instructors",
            items: deptInstructors.map((i) => ({
                field: i.user.name,
                url: "/instructors",
                param: i.id,
            })),
        });
    }

    const deptCourses = await db
        .select(getTableColumns(course))
        .from(course)
        .where(
            and(
                eq(course.departmentId, currentHod.departmentId),
                or(ilike(course.code, pattern), ilike(course.title, pattern))
            )
        )
        .limit(3);

    if (deptCourses.length > 0) {
        results.push({
            title: "Department Courses",
            items: deptCourses.map((c) => ({
                field: `${c.code} - ${c.title}`,
                url: "/courses",
                param: c.id,
            })),
        });
    }

    const deptPrograms = await db
        .select(getTableColumns(program))
        .from(program)
        .where(
            and(
                eq(program.departmentId, currentHod.departmentId),
                or(ilike(program.name, pattern), ilike(program.code, pattern))
            )
        )
        .limit(3);

    if (deptPrograms.length > 0) {
        results.push({
            title: "Department Programs",
            items: deptPrograms.map((p) => ({
                field: `${p.code} - ${p.name}`,
                url: "/programs",
                param: p.id,
            })),
        });
    }

    const deptAdvisors = await db
        .select({
            id: advisor.id,
            user: user,
        })
        .from(advisor)
        .innerJoin(user, eq(advisor.userId, user.id))
        .where(
            and(
                eq(advisor.departmentId, currentHod.departmentId),
                or(ilike(user.name, pattern), ilike(user.email, pattern))
            )
        )
        .limit(3);

    if (deptAdvisors.length > 0) {
        results.push({
            title: "Department Advisors",
            items: deptAdvisors.map((a) => ({
                field: a.user.name,
                url: "/advisors",
                param: a.id,
            })),
        });
    }

    const deptStudents = await db
        .select({
            id: student.id,
            rollNo: student.rollNo,
            user: user,
        })
        .from(student)
        .innerJoin(user, eq(student.userId, user.id))
        .innerJoin(batch, eq(student.batchId, batch.id))
        .innerJoin(program, eq(batch.programId, program.id))
        .where(
            and(
                eq(program.departmentId, currentHod.departmentId),
                or(ilike(student.rollNo, pattern), ilike(user.name, pattern))
            )
        )
        .limit(3);

    if (deptStudents.length > 0) {
        results.push({
            title: "Department Students",
            items: deptStudents.map((s) => ({
                field: `${s.rollNo} - ${s.user.name}`,
                url: "/students",
                param: s.id,
            })),
        });
    }
}

export async function searchForInstructor(
    query: string,
    results: SpotlightResult,
    userId: string
) {
    const currentInstructor = await db.query.instructor.findFirst({
        where: eq(instructor.userId, userId),
    });
    if (!currentInstructor) return;

    const pattern = searchPattern(query);

    const courses = await db
        .select({
            offering: courseOffering,
            course: course,
            semester: semester,
        })
        .from(courseOfferingInstructor)
        .innerJoin(
            courseOffering,
            eq(courseOfferingInstructor.offeringId, courseOffering.id)
        )
        .innerJoin(course, eq(courseOffering.courseId, course.id))
        .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
        .where(
            and(
                eq(courseOfferingInstructor.instructorId, currentInstructor.id),
                or(ilike(course.code, pattern), ilike(course.title, pattern))
            )
        )
        .limit(3);

    if (courses.length) {
        results.push({
            title: "My Courses",
            items: courses.map((o) => ({
                field: `${o.course.code} - ${o.course.title}`,
                url: "/courses",
                param: o.course.id,
            })),
        });
    }

    const enrollments = await db
        .select({
            enrollment: enrollment,
            student: student,
            user: user,
        })
        .from(enrollment)
        .innerJoin(student, eq(enrollment.studentId, student.id))
        .innerJoin(user, eq(student.userId, user.id))
        .innerJoin(courseOffering, eq(enrollment.offeringId, courseOffering.id))
        .innerJoin(
            courseOfferingInstructor,
            eq(courseOfferingInstructor.offeringId, courseOffering.id)
        )
        .where(
            and(
                eq(courseOfferingInstructor.instructorId, currentInstructor.id),
                or(ilike(student.rollNo, pattern), ilike(user.name, pattern))
            )
        )
        .limit(3);

    if (enrollments.length) {
        results.push({
            title: "My Students",
            items: enrollments.map((e) => ({
                field: `${e.student.rollNo} - ${e.user.name}`,
                url: "/students",
                param: e.student.id,
            })),
        });
    }
}

export async function searchForAdvisor(
    query: string,
    results: SpotlightResult,
    userId: string
) {
    const currentAdvisor = await db.query.advisor.findFirst({
        where: eq(advisor.userId, userId),
    });
    if (!currentAdvisor) return;

    const pattern = searchPattern(query);

    const batches = await db
        .select({
            id: batch.id,
            year: batch.year,
            program: program,
        })
        .from(batch)
        .leftJoin(program, eq(batch.programId, program.id))
        .where(
            and(
                eq(batch.advisorId, currentAdvisor.id),
                or(
                    sql`CAST(${batch.year} AS TEXT) ILIKE ${pattern}`,
                    ilike(program.name, pattern),
                    ilike(program.code, pattern)
                )
            )
        )
        .limit(3);

    if (batches.length > 0) {
        results.push({
            title: "My Batches",
            items: batches.map((b) => ({
                field: `${b.program?.name || "Unknown"} - ${b.year}`,
                url: "/batches",
                param: b.id,
            })),
        });
    }

    const students = await db
        .select({
            id: student.id,
            rollNo: student.rollNo,
            user: user,
            batch: batch,
        })
        .from(student)
        .innerJoin(user, eq(student.userId, user.id))
        .innerJoin(batch, eq(student.batchId, batch.id))
        .where(
            and(
                eq(batch.advisorId, currentAdvisor.id),
                or(ilike(user.name, pattern), ilike(student.rollNo, pattern))
            )
        )
        .limit(3);

    if (students.length > 0) {
        results.push({
            title: "My Students",
            items: students.map((s) => ({
                field: `${s.rollNo} - ${s.user.name}`,
                url: "/students",
                param: s.id,
            })),
        });
    }

    const pendingEnrollments = await db
        .select({
            enrollment: enrollment,
            student: student,
            user: user,
            course: course,
        })
        .from(enrollment)
        .innerJoin(student, eq(enrollment.studentId, student.id))
        .innerJoin(user, eq(student.userId, user.id))
        .innerJoin(batch, eq(student.batchId, batch.id))
        .innerJoin(courseOffering, eq(enrollment.offeringId, courseOffering.id))
        .innerJoin(course, eq(courseOffering.courseId, course.id))
        .where(
            and(
                eq(batch.advisorId, currentAdvisor.id),
                eq(enrollment.status, "INSTRUCTOR_APPROVED"),
                or(
                    ilike(student.rollNo, pattern),
                    ilike(user.name, pattern),
                    ilike(course.code, pattern),
                    ilike(course.title, pattern)
                )
            )
        )
        .limit(3);

    if (pendingEnrollments.length > 0) {
        results.push({
            title: "Pending Approvals",
            items: pendingEnrollments.map((e) => ({
                field: `${e.student.rollNo} - ${e.course.code}`,
                url: "/enrollments",
                param: e.enrollment.id,
            })),
        });
    }
}

export async function searchForStudent(
    query: string,
    results: SpotlightResult,
    userId: string
) {
    const studentRecord = await db.query.student.findFirst({
        where: eq(student.userId, userId),
    });

    if (!studentRecord) return;

    const pattern = searchPattern(query);

    const courses = await db
        .select(getTableColumns(course))
        .from(course)
        .where(or(ilike(course.code, pattern), ilike(course.title, pattern)))
        .limit(3);

    if (courses.length > 0) {
        results.push({
            title: "Courses",
            items: courses.map((c) => ({
                field: `${c.code} - ${c.title}`,
                url: "/courses",
                param: c.id,
            })),
        });
    }

    const enrollments = await db
        .select({
            enrollment: enrollment,
            offering: courseOffering,
            course: course,
        })
        .from(enrollment)
        .innerJoin(courseOffering, eq(enrollment.offeringId, courseOffering.id))
        .innerJoin(course, eq(courseOffering.courseId, course.id))
        .where(
            and(
                eq(enrollment.studentId, studentRecord.id),
                eq(enrollment.status, "ENROLLED"),
                or(ilike(course.code, pattern), ilike(course.title, pattern))
            )
        )
        .limit(3);

    if (enrollments.length > 0) {
        results.push({
            title: "My Enrollments",
            items: enrollments.map((e) => ({
                field: `${e.course.code} - ${e.course.title}`,
                url: "/enrollments",
                param: e.enrollment.id,
            })),
        });
    }
}
