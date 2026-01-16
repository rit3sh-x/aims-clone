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
    enrollment,
    semester,
} from "@workspace/db";
import { SpotlightResult } from "./schema";
import { sql, and, eq, desc, getTableColumns } from "drizzle-orm";
import { Semester } from "../types/schema";

export async function searchForAdmin(query: string, results: SpotlightResult) {
    const courses = await db
        .select({
            ...getTableColumns(course),
            rank: sql<number>`ts_rank(
                setweight(to_tsvector('english', ${course.code}), 'A') ||
                setweight(to_tsvector('english', ${course.title}), 'B'),
                websearch_to_tsquery('english', ${query})
            )`,
        })
        .from(course)
        .where(
            sql`(
                setweight(to_tsvector('english', ${course.code}), 'A') ||
                setweight(to_tsvector('english', ${course.title}), 'B')
            ) @@ websearch_to_tsquery('english', ${query})`
        )
        .orderBy((t) => desc(t.rank))
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
            employeeId: instructor.employeeId,
            user: user,
            department: department,
            rank: sql<number>`ts_rank(
                setweight(to_tsvector('english', ${user.name}), 'A') ||
                setweight(to_tsvector('english', ${user.email}), 'B') ||
                setweight(to_tsvector('english', ${instructor.employeeId}), 'C'),
                websearch_to_tsquery('english', ${query})
            )`,
        })
        .from(instructor)
        .innerJoin(user, eq(instructor.userId, user.id))
        .leftJoin(department, eq(instructor.departmentId, department.id))
        .where(
            sql`(
                setweight(to_tsvector('english', ${user.name}), 'A') ||
                setweight(to_tsvector('english', ${user.email}), 'B') ||
                setweight(to_tsvector('english', ${instructor.employeeId}), 'C')
            ) @@ websearch_to_tsquery('english', ${query})`
        )
        .orderBy((t) => desc(t.rank))
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
            rank: sql<number>`ts_rank(
                setweight(to_tsvector('english', ${student.rollNo}), 'A') ||
                setweight(to_tsvector('english', ${user.name}), 'B'),
                websearch_to_tsquery('english', ${query})
            )`,
        })
        .from(student)
        .innerJoin(user, eq(student.userId, user.id))
        .leftJoin(batch, eq(student.batchId, batch.id))
        .leftJoin(program, eq(batch.programId, program.id))
        .where(
            sql`(
                setweight(to_tsvector('english', ${student.rollNo}), 'A') ||
                setweight(to_tsvector('english', ${user.name}), 'B')
            ) @@ websearch_to_tsquery('english', ${query})`
        )
        .orderBy((t) => desc(t.rank))
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
        .select({
            ...getTableColumns(department),
            rank: sql<number>`ts_rank(
                setweight(to_tsvector('english', ${department.name}), 'A') ||
                setweight(to_tsvector('english', CAST(${department.code} AS TEXT)), 'B'),
                websearch_to_tsquery('english', ${query})
            )`,
        })
        .from(department)
        .where(
            sql`(
                setweight(to_tsvector('english', ${department.name}), 'A') ||
                setweight(to_tsvector('english', CAST(${department.code} AS TEXT)), 'B')
            ) @@ websearch_to_tsquery('english', ${query})`
        )
        .orderBy((t) => desc(t.rank))
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
        .select({
            ...getTableColumns(program),
            rank: sql<number>`ts_rank(
                setweight(to_tsvector('english', ${program.name}), 'A') ||
                setweight(to_tsvector('english', ${program.code}), 'B'),
                websearch_to_tsquery('english', ${query})
            )`,
        })
        .from(program)
        .where(
            sql`(
                setweight(to_tsvector('english', ${program.name}), 'A') ||
                setweight(to_tsvector('english', ${program.code}), 'B')
            ) @@ websearch_to_tsquery('english', ${query})`
        )
        .orderBy((t) => desc(t.rank))
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
            rank: sql<number>`ts_rank(
                to_tsvector('english', CAST(${batch.year} AS TEXT)),
                websearch_to_tsquery('english', ${query})
            )`,
        })
        .from(batch)
        .leftJoin(program, eq(batch.programId, program.id))
        .where(
            sql`to_tsvector('english', CAST(${batch.year} AS TEXT)) @@ websearch_to_tsquery('english', ${query})`
        )
        .orderBy((t) => desc(t.rank))
        .limit(3);

    if (batches.length > 0) {
        results.push({
            title: "Batches",
            items: batches.map((b) => ({
                field: `${b.program?.name || 'Unknown'} - ${b.year}`,
                url: "/batches",
                param: b.id,
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

    const courses = await db
        .select({
            offering: courseOffering,
            course: course,
            semester: semester,
            rank: sql<number>`ts_rank(
                setweight(to_tsvector('english', ${course.code}), 'A') ||
                setweight(to_tsvector('english', ${course.title}), 'B'),
                websearch_to_tsquery('english', ${query})
            )`,
        })
        .from(courseOffering)
        .innerJoin(course, eq(courseOffering.courseId, course.id))
        .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
        .where(
            and(
                eq(courseOffering.instructorId, currentInstructor.id),
                sql`(
                    setweight(to_tsvector('english', ${course.code}), 'A') ||
                    setweight(to_tsvector('english', ${course.title}), 'B')
                ) @@ websearch_to_tsquery('english', ${query})`
            )
        )
        .orderBy((t) => [desc(t.rank), desc(semester.year)])
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
            offering: courseOffering,
            rank: sql<number>`ts_rank(
                setweight(to_tsvector('english', ${student.rollNo}), 'A') ||
                setweight(to_tsvector('english', ${user.name}), 'B'),
                websearch_to_tsquery('english', ${query})
            )`,
        })
        .from(enrollment)
        .innerJoin(student, eq(enrollment.studentId, student.id))
        .innerJoin(user, eq(student.userId, user.id))
        .innerJoin(courseOffering, eq(enrollment.offeringId, courseOffering.id))
        .where(
            and(
                eq(courseOffering.instructorId, currentInstructor.id),
                sql`(
                    setweight(to_tsvector('english', ${student.rollNo}), 'A') ||
                    setweight(to_tsvector('english', ${user.name}), 'B')
                ) @@ websearch_to_tsquery('english', ${query})`
            )
        )
        .orderBy((t) => desc(t.rank))
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

export async function searchForBatchAdvisor(
    query: string,
    results: SpotlightResult,
    userId: string
) {
    const batches = await db
        .select({
            id: batch.id,
            year: batch.year,
            program: program,
            rank: sql<number>`ts_rank(
                to_tsvector('english', CAST(${batch.year} AS TEXT)),
                websearch_to_tsquery('english', ${query})
            )`,
        })
        .from(batch)
        .leftJoin(program, eq(batch.programId, program.id))
        .where(
            and(
                eq(batch.advisorId, userId),
                sql`to_tsvector('english', CAST(${batch.year} AS TEXT)) @@ websearch_to_tsquery('english', ${query})`
            )
        )
        .orderBy((t) => desc(t.rank))
        .limit(3);

    if (batches.length > 0) {
        results.push({
            title: "My Batches",
            items: batches.map((b) => ({
                field: `${b.program?.name || 'Unknown'} - ${b.year}`,
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
            rank: sql<number>`ts_rank(
                setweight(to_tsvector('english', ${user.name}), 'A') ||
                setweight(to_tsvector('english', ${student.rollNo}), 'B'),
                websearch_to_tsquery('english', ${query})
            )`,
        })
        .from(student)
        .innerJoin(user, eq(student.userId, user.id))
        .innerJoin(batch, eq(student.batchId, batch.id))
        .where(
            and(
                eq(batch.advisorId, userId),
                sql`(
                    setweight(to_tsvector('english', ${user.name}), 'A') ||
                    setweight(to_tsvector('english', ${student.rollNo}), 'B')
                ) @@ websearch_to_tsquery('english', ${query})`
            )
        )
        .orderBy((t) => desc(t.rank))
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
}

export async function searchForStudent(
    query: string,
    results: SpotlightResult,
    userId: string,
    currentSemester: Semester
) {
    const studentRecord = await db.query.student.findFirst({
        where: eq(student.userId, userId),
    });

    if (!studentRecord) return;

    const courses = await db
        .select({
            ...getTableColumns(course),
            rank: sql<number>`ts_rank(
                setweight(to_tsvector('english', ${course.code}), 'A') ||
                setweight(to_tsvector('english', ${course.title}), 'B'),
                websearch_to_tsquery('english', ${query})
            )`,
        })
        .from(course)
        .where(
            sql`(
                setweight(to_tsvector('english', ${course.code}), 'A') ||
                setweight(to_tsvector('english', ${course.title}), 'B')
            ) @@ websearch_to_tsquery('english', ${query})`
        )
        .orderBy((t) => desc(t.rank))
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
            instructor: instructor,
            user: user,
            rank: sql<number>`ts_rank(
                setweight(to_tsvector('english', ${course.code}), 'A') ||
                setweight(to_tsvector('english', ${course.title}), 'B'),
                websearch_to_tsquery('english', ${query})
            )`,
        })
        .from(enrollment)
        .innerJoin(courseOffering, eq(enrollment.offeringId, courseOffering.id))
        .innerJoin(course, eq(courseOffering.courseId, course.id))
        .leftJoin(instructor, eq(courseOffering.instructorId, instructor.id))
        .leftJoin(user, eq(instructor.userId, user.id))
        .where(
            and(
                eq(enrollment.studentId, studentRecord.id),
                currentSemester ? eq(enrollment.status, "ENROLLED") : undefined,
                sql`(
                    setweight(to_tsvector('english', ${course.code}), 'A') ||
                    setweight(to_tsvector('english', ${course.title}), 'B')
                ) @@ websearch_to_tsquery('english', ${query})`
            )
        )
        .orderBy((t) => desc(t.rank))
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