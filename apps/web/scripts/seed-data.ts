import "dotenv/config";
import {
    db,
    department,
    hod,
    program,
    advisor,
    batch,
    student,
    instructor,
    course,
    prerequisite,
    semester,
    courseOffering,
    courseOfferingInstructor,
    offeringBatch,
    enrollment,
    attendance,
    assessmentTemplate,
    assessment,
    grade,
    classroom,
    timeSlot,
    schedule,
    feedbackQuestion,
    courseFeedback,
    feedbackResponse,
} from "@workspace/db";
import { createBulkUsers } from "./utils";
import * as data from "./dummy-data";

const DEFAULT_PASSWORD = "abcd1234";

async function seedDepartments() {
    console.log("Seeding departments...");
    const depts = await db
        .insert(department)
        .values(data.departments)
        .returning();
    console.log(`✓ Created ${depts.length} departments`);
    return depts;
}

async function seedHODs(depts: (typeof department.$inferSelect)[]) {
    console.log("Seeding HODs...");

    const hodUsers = await createBulkUsers(
        data.hods.map((h) => ({
            name: h.name,
            email: h.email,
            role: "HOD" as const,
            password: DEFAULT_PASSWORD,
        }))
    );

    const deptMap = new Map(depts.map((d) => [d.code, d.id]));
    const hodRecords = await db
        .insert(hod)
        .values(
            data.hods.map((h, i) => ({
                userId: hodUsers[i]!.id,
                phoneNumber: h.phoneNumber,
                website: h.website,
                employeeId: h.employeeId,
                departmentId: deptMap.get(h.deptCode)!,
            }))
        )
        .returning();

    console.log(`✓ Created ${hodRecords.length} HODs`);
    return hodRecords;
}

async function seedPrograms(depts: (typeof department.$inferSelect)[]) {
    console.log("Seeding programs...");

    const deptMap = new Map(depts.map((d) => [d.code, d.id]));
    const programs = await db
        .insert(program)
        .values(
            data.programs.map((p) => ({
                name: p.name,
                code: p.code,
                degreeType: p.degreeType,
                departmentId: deptMap.get(p.deptCode)!,
            }))
        )
        .returning();

    console.log(`✓ Created ${programs.length} programs`);
    return programs;
}

async function seedAdvisors(depts: (typeof department.$inferSelect)[]) {
    console.log("Seeding advisors...");

    const advisorUsers = await createBulkUsers(
        data.advisors.map((a) => ({
            name: a.name,
            email: a.email,
            role: "ADVISOR" as const,
            password: DEFAULT_PASSWORD,
        }))
    );

    const deptMap = new Map(depts.map((d) => [d.code, d.id]));
    const advisorRecords = await db
        .insert(advisor)
        .values(
            data.advisors.map((a, i) => ({
                userId: advisorUsers[i]!.id,
                phoneNumber: a.phoneNumber,
                website: a.website,
                employeeId: a.employeeId,
                departmentId: deptMap.get(a.deptCode)!,
            }))
        )
        .returning();

    console.log(`✓ Created ${advisorRecords.length} advisors`);
    return advisorRecords;
}

async function seedInstructors(depts: (typeof department.$inferSelect)[]) {
    console.log("Seeding instructors...");

    const instructorUsers = await createBulkUsers(
        data.instructors.map((i) => ({
            name: i.name,
            email: i.email,
            role: "INSTRUCTOR" as const,
            password: DEFAULT_PASSWORD,
        }))
    );

    const deptMap = new Map(depts.map((d) => [d.code, d.id]));
    const instructorRecords = await db
        .insert(instructor)
        .values(
            data.instructors.map((inst, i) => ({
                userId: instructorUsers[i]!.id,
                phoneNumber: inst.phoneNumber,
                website: inst.website,
                employeeId: inst.employeeId,
                departmentId: deptMap.get(inst.deptCode)!,
                designation: inst.designation,
            }))
        )
        .returning();

    console.log(`✓ Created ${instructorRecords.length} instructors`);
    return instructorRecords;
}

async function seedBatches(programs: (typeof program.$inferSelect)[]) {
    console.log("Seeding batches...");

    const programMap = new Map(programs.map((p) => [p.code, p.id]));
    const batchData = [];

    for (const prog of data.programs) {
        for (const year of [2021, 2022, 2023, 2024]) {
            batchData.push({
                year,
                programId: programMap.get(prog.code)!,
            });
        }
    }

    const batches = await db.insert(batch).values(batchData).returning();
    console.log(`✓ Created ${batches.length} batches`);
    return batches;
}

async function seedStudents(
    batches: (typeof batch.$inferSelect)[],
    advisors: (typeof advisor.$inferSelect)[],
    programs: (typeof program.$inferSelect)[]
) {
    console.log("Seeding students...");

    const studentUsers = await createBulkUsers(
        data.students.map((s) => ({
            name: s.name,
            email: s.email,
            role: "STUDENT" as const,
            password: DEFAULT_PASSWORD,
        }))
    );

    const programMap = new Map(programs.map((p) => [p.code, p.id]));
    const advisorMap = new Map(advisors.map((a) => [a.employeeId, a.id]));
    const batchMap = new Map(
        batches.map((b) => [`${b.year}-${b.programId}`, b.id])
    );

    const studentRecords = await db
        .insert(student)
        .values(
            data.students.map((s, i) => ({
                userId: studentUsers[i]!.id,
                rollNo: s.rollNo,
                batchId: batchMap.get(
                    `${s.batchYear}-${programMap.get(s.programCode)}`
                )!,
                advisorId: advisorMap.get(s.advisorEmployeeId)!,
            }))
        )
        .returning();

    console.log(`✓ Created ${studentRecords.length} students`);
    return studentRecords;
}

async function seedCourses(depts: (typeof department.$inferSelect)[]) {
    console.log("Seeding courses...");

    const deptMap = new Map(depts.map((d) => [d.code, d.id]));
    const courses = await db
        .insert(course)
        .values(
            data.courses.map((c) => ({
                code: c.code,
                title: c.title,
                lectureHours: c.lectureHours,
                tutorialHours: c.tutorialHours,
                practicalHours: c.practicalHours,
                selfStudyHours: c.selfStudyHours,
                credits: c.credits,
                departmentId: deptMap.get(c.deptCode)!,
                description: c.description,
                status: "ADMIN_ACCEPTED" as const,
            }))
        )
        .returning();

    console.log(`✓ Created ${courses.length} courses`);
    return courses;
}

async function seedPrerequisites(courses: (typeof course.$inferSelect)[]) {
    console.log("Seeding prerequisites...");

    const courseMap = new Map(courses.map((c) => [c.code, c.id]));
    const prereqs = await db
        .insert(prerequisite)
        .values(
            data.prerequisites.map((p) => ({
                courseId: courseMap.get(p.courseCode)!,
                prerequisiteCourseId: courseMap.get(p.prerequisiteCode)!,
            }))
        )
        .returning();

    console.log(`✓ Created ${prereqs.length} prerequisites`);
    return prereqs;
}

async function seedSemesters() {
    console.log("Seeding semesters...");

    const semesters = await db
        .insert(semester)
        .values(data.semesters)
        .returning();
    console.log(`✓ Created ${semesters.length} semesters`);
    return semesters;
}

async function seedClassrooms() {
    console.log("Seeding classrooms...");

    const classrooms = await db
        .insert(classroom)
        .values(data.classrooms)
        .returning();
    console.log(`✓ Created ${classrooms.length} classrooms`);
    return classrooms;
}

async function seedTimeSlots() {
    console.log("Seeding time slots...");

    const slots = await db.insert(timeSlot).values(data.timeSlots).returning();
    console.log(`✓ Created ${slots.length} time slots`);
    return slots;
}

async function seedFeedbackQuestions() {
    console.log("Seeding feedback questions...");

    const questions = await db
        .insert(feedbackQuestion)
        .values(data.feedbackQuestions)
        .returning();
    console.log(`✓ Created ${questions.length} feedback questions`);
    return questions;
}

async function seedCourseOfferings(
    courses: (typeof course.$inferSelect)[],
    semesters: (typeof semester.$inferSelect)[],
    instructors: (typeof instructor.$inferSelect)[],
    batches: (typeof batch.$inferSelect)[],
    programs: (typeof program.$inferSelect)[]
) {
    console.log("Seeding course offerings...");

    const courseMap = new Map(courses.map((c) => [c.code, c.id]));
    const instructorMap = new Map(instructors.map((i) => [i.employeeId, i.id]));
    const programMap = new Map(programs.map((p) => [p.code, p.id]));

    const spring2025 = semesters.find(
        (s) => s.year === 2025 && s.semester === "EVEN"
    );

    if (!spring2025) {
        console.log(
            "⚠ No 2025 EVEN semester found, skipping current offerings"
        );
        return [];
    }

    const offerings = await db
        .insert(courseOffering)
        .values(
            data.courseOfferings2025Spring.map((co) => ({
                courseId: courseMap.get(co.courseCode)!,
                semesterId: spring2025.id,
                status: "ONGOING" as const,
            }))
        )
        .returning();

    const instructorAssignments = [];
    for (let i = 0; i < data.courseOfferings2025Spring.length; i++) {
        const co = data.courseOfferings2025Spring[i];
        for (const empId of co!.instructorEmployeeIds) {
            instructorAssignments.push({
                offeringId: offerings[i]!.id,
                instructorId: instructorMap.get(empId)!,
                isHead: empId === co!.headEmployeeId,
            });
        }
    }
    await db.insert(courseOfferingInstructor).values(instructorAssignments);

    const batchAssignments = [];
    for (let i = 0; i < data.courseOfferings2025Spring.length; i++) {
        const co = data.courseOfferings2025Spring[i]!;
        for (const progCode of co.programCodes) {
            const programId = programMap.get(progCode);
            if (!programId) continue;
            for (const year of co.batchYears) {
                const batchId = batches.find(
                    (b) => b.year === year && b.programId === programId
                )?.id;
                if (batchId) {
                    batchAssignments.push({
                        offeringId: offerings[i]!.id,
                        batchId,
                    });
                }
            }
        }
    }

    if (batchAssignments.length > 0) {
        await db.insert(offeringBatch).values(batchAssignments);
    }

    console.log(`✓ Created ${offerings.length} course offerings`);
    return offerings;
}

async function seedEnrollments(
    students: (typeof student.$inferSelect)[],
    offerings: (typeof courseOffering.$inferSelect)[],
    batches: (typeof batch.$inferSelect)[]
) {
    console.log("Seeding enrollments...");

    const enrollments = [];

    const offeringBatches = await db.select().from(offeringBatch);
    const offeringBatchMap = new Map<string, string[]>();

    for (const ob of offeringBatches) {
        if (!offeringBatchMap.has(ob.offeringId)) {
            offeringBatchMap.set(ob.offeringId, []);
        }
        offeringBatchMap.get(ob.offeringId)!.push(ob.batchId);
    }

    for (const stud of students) {
        for (const offer of offerings) {
            const allowedBatches = offeringBatchMap.get(offer.id) || [];
            if (allowedBatches.includes(stud.batchId)) {
                enrollments.push({
                    studentId: stud.id,
                    offeringId: offer.id,
                    status: "ENROLLED" as const,
                    instructorApprovedAt: new Date(),
                    advisorApprovedAt: new Date(),
                });
            }
        }
    }

    const enrollmentRecords = await db
        .insert(enrollment)
        .values(enrollments)
        .returning();
    console.log(`✓ Created ${enrollmentRecords.length} enrollments`);
    return enrollmentRecords;
}

async function seedAssessmentTemplates(
    offerings: (typeof courseOffering.$inferSelect)[]
) {
    console.log("Seeding assessment templates...");

    const templates = [];
    for (const offer of offerings) {
        templates.push(
            {
                offeringId: offer.id,
                type: "QUIZ" as const,
                maxMarks: 10,
                weightage: 10,
            },
            {
                offeringId: offer.id,
                type: "ASSIGNMENT" as const,
                maxMarks: 20,
                weightage: 20,
            },
            {
                offeringId: offer.id,
                type: "MIDTERM" as const,
                maxMarks: 30,
                weightage: 30,
            },
            {
                offeringId: offer.id,
                type: "ENDTERM" as const,
                maxMarks: 40,
                weightage: 40,
            }
        );
    }

    const templateRecords = await db
        .insert(assessmentTemplate)
        .values(templates)
        .returning();
    console.log(`✓ Created ${templateRecords.length} assessment templates`);
    return templateRecords;
}

async function seedAssessments(
    enrollments: (typeof enrollment.$inferSelect)[],
    templates: (typeof assessmentTemplate.$inferSelect)[]
) {
    console.log("Seeding assessments...");

    const templatesByOffering = new Map<
        string,
        (typeof assessmentTemplate.$inferSelect)[]
    >();
    for (const tmpl of templates) {
        if (!templatesByOffering.has(tmpl.offeringId)) {
            templatesByOffering.set(tmpl.offeringId, []);
        }
        templatesByOffering.get(tmpl.offeringId)!.push(tmpl);
    }

    const assessments = [];
    for (const enr of enrollments) {
        const offerTemplates = templatesByOffering.get(enr.offeringId) || [];
        for (const tmpl of offerTemplates) {
            const marksObtained = Math.random() * tmpl.maxMarks;
            assessments.push({
                enrollmentId: enr.id,
                templateId: tmpl.id,
                marksObtained: Number(marksObtained.toFixed(2)),
            });
        }
    }

    const assessmentRecords = await db
        .insert(assessment)
        .values(assessments)
        .returning();
    console.log(`✓ Created ${assessmentRecords.length} assessments`);
    return assessmentRecords;
}

async function seedGrades(
    enrollments: (typeof enrollment.$inferSelect)[],
    assessments: (typeof assessment.$inferSelect)[]
) {
    console.log("Seeding grades...");

    const assessmentsByEnrollment = new Map<
        string,
        (typeof assessment.$inferSelect)[]
    >();
    for (const asmt of assessments) {
        if (!assessmentsByEnrollment.has(asmt.enrollmentId)) {
            assessmentsByEnrollment.set(asmt.enrollmentId, []);
        }
        assessmentsByEnrollment.get(asmt.enrollmentId)!.push(asmt);
    }

    const grades = [];
    for (const enr of enrollments) {
        const enrAssessments = assessmentsByEnrollment.get(enr.id) || [];
        const totalMarks = enrAssessments.reduce(
            (sum, a) => sum + a.marksObtained,
            0
        );

        let gradeValue: "A" | "B" | "C" | "D" | "F";
        if (totalMarks >= 90) gradeValue = "A";
        else if (totalMarks >= 80) gradeValue = "B";
        else if (totalMarks >= 70) gradeValue = "C";
        else if (totalMarks >= 60) gradeValue = "D";
        else gradeValue = "F";

        grades.push({
            enrollmentId: enr.id,
            totalMarks: Number(totalMarks.toFixed(2)),
            grade: gradeValue,
        });
    }

    const gradeRecords = await db.insert(grade).values(grades).returning();
    console.log(`✓ Created ${gradeRecords.length} grades`);
    return gradeRecords;
}

async function seedAttendance(enrollments: (typeof enrollment.$inferSelect)[]) {
    console.log("Seeding attendance...");

    const attendanceRecords = [];
    const startDate = new Date("2025-01-10");
    const numDays = 30;

    for (const enr of enrollments.slice(0, 50)) {
        for (let i = 0; i < numDays; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);

            if (date.getDay() !== 0 && date.getDay() !== 6) {
                const rand = Math.random();
                attendanceRecords.push({
                    enrollmentId: enr.id,
                    date,
                    status:
                        rand > 0.1 ? ("PRESENT" as const) : ("ABSENT" as const),
                    type: "LECTURE" as const,
                });
            }
        }
    }

    const records = await db
        .insert(attendance)
        .values(attendanceRecords)
        .returning();
    console.log(`✓ Created ${records.length} attendance records`);
    return records;
}

async function seedSchedules(
    offerings: (typeof courseOffering.$inferSelect)[],
    timeSlots: (typeof timeSlot.$inferSelect)[],
    classrooms: (typeof classroom.$inferSelect)[]
) {
    console.log("Seeding schedules...");

    const schedules = [];
    let slotIndex = 0;
    let roomIndex = 0;

    for (const offer of offerings) {
        const slot = timeSlots[slotIndex % timeSlots.length];
        const room = classrooms[roomIndex % classrooms.length];

        schedules.push({
            offeringId: offer.id,
            timeSlotId: slot!.id,
            classroomId: room!.id,
            effectiveFrom: new Date("2025-01-10"),
            effectiveTo: new Date("2025-05-20"),
        });

        slotIndex++;
        roomIndex++;
    }

    const scheduleRecords = await db
        .insert(schedule)
        .values(schedules)
        .returning();
    console.log(`✓ Created ${scheduleRecords.length} schedules`);
    return scheduleRecords;
}

async function seedCourseFeedback(
    enrollments: (typeof enrollment.$inferSelect)[],
    questions: (typeof feedbackQuestion.$inferSelect)[]
) {
    console.log("Seeding course feedback...");

    const feedbacks = [];
    for (const enr of enrollments.slice(0, 40)) {
        feedbacks.push({
            enrollmentId: enr.id,
        });
    }

    const feedbackRecords = await db
        .insert(courseFeedback)
        .values(feedbacks)
        .returning();

    const responses = [];
    for (const fb of feedbackRecords) {
        for (const q of questions) {
            if (q.questionType === "RATING") {
                responses.push({
                    feedbackId: fb.id,
                    questionId: q.id,
                    ratingAnswer: Math.floor(Math.random() * 5) + 1,
                });
            } else if (q.questionType === "YES_NO") {
                responses.push({
                    feedbackId: fb.id,
                    questionId: q.id,
                    yesNoAnswer: Math.random() > 0.5,
                });
            } else {
                responses.push({
                    feedbackId: fb.id,
                    questionId: q.id,
                    descriptiveAnswer: "Sample feedback response",
                });
            }
        }
    }

    await db.insert(feedbackResponse).values(responses);
    console.log(
        `✓ Created ${feedbackRecords.length} feedback forms with ${responses.length} responses`
    );
}

async function seedHistoricalOfferings(
    courses: (typeof course.$inferSelect)[],
    semesters: (typeof semester.$inferSelect)[],
    instructors: (typeof instructor.$inferSelect)[],
    batches: (typeof batch.$inferSelect)[],
    programs: (typeof program.$inferSelect)[],
    students: (typeof student.$inferSelect)[]
) {
    console.log("Seeding historical course offerings and grades...");

    const courseMap = new Map(courses.map((c) => [c.code, c.id]));
    const instructorMap = new Map(instructors.map((i) => [i.employeeId, i.id]));
    const programMap = new Map(programs.map((p) => [p.code, p.id]));
    const semesterMap = new Map(
        semesters.map((s) => [`${s.year}-${s.semester}`, s])
    );

    const completedSemesters = semesters.filter(
        (s) => s.status === "COMPLETED"
    );
    let totalEnrollments = 0;
    let totalGrades = 0;

    for (const sem of completedSemesters) {
        const semKey = `${sem.year}-${sem.semester}`;
        const offeringData = data.historicalCourseOfferings[semKey];

        if (!offeringData) continue;

        const offerings = await db
            .insert(courseOffering)
            .values(
                offeringData.map((co) => ({
                    courseId: courseMap.get(co.courseCode)!,
                    semesterId: sem.id,
                    status: "COMPLETED" as const,
                }))
            )
            .returning();

        const instructorAssignments = [];
        for (let i = 0; i < offeringData.length; i++) {
            const co = offeringData[i]!;
            for (const empId of co.instructorEmployeeIds) {
                instructorAssignments.push({
                    offeringId: offerings[i]!.id,
                    instructorId: instructorMap.get(empId)!,
                    isHead: empId === co.headEmployeeId,
                });
            }
        }
        if (instructorAssignments.length > 0) {
            await db
                .insert(courseOfferingInstructor)
                .values(instructorAssignments);
        }

        const batchAssignments = [];
        for (let i = 0; i < offeringData.length; i++) {
            const co = offeringData[i]!;
            for (const progCode of co.programCodes) {
                const programId = programMap.get(progCode);
                if (!programId) continue;
                for (const year of co.batchYears) {
                    const batchId = batches.find(
                        (b) => b.year === year && b.programId === programId
                    )?.id;
                    if (batchId) {
                        batchAssignments.push({
                            offeringId: offerings[i]!.id,
                            batchId,
                        });
                    }
                }
            }
        }
        if (batchAssignments.length > 0) {
            await db.insert(offeringBatch).values(batchAssignments);
        }

        for (let i = 0; i < offerings.length; i++) {
            const offer = offerings[i]!;
            const co = offeringData[i]!;

            const eligibleStudents = students.filter((s) => {
                const studentBatch = batches.find((b) => b.id === s.batchId);
                if (!studentBatch) return false;

                const studentProgram = programs.find(
                    (p) => p.id === studentBatch.programId
                );
                if (!studentProgram) return false;

                return (
                    co.batchYears.includes(studentBatch.year) &&
                    co.programCodes.includes(studentProgram.code)
                );
            });

            if (eligibleStudents.length === 0) continue;

            const enrollmentValues = eligibleStudents.map((s) => ({
                studentId: s.id,
                offeringId: offer.id,
                status: "COMPLETED" as const,
                instructorApprovedAt: sem.startDate,
                advisorApprovedAt: sem.startDate,
            }));

            const enrollmentRecords = await db
                .insert(enrollment)
                .values(enrollmentValues)
                .returning();

            totalEnrollments += enrollmentRecords.length;

            const gradeValues = enrollmentRecords.map((enr) => {
                const stud = eligibleStudents.find(
                    (s) => s.id === enr.studentId
                );
                const profile =
                    data.studentPerformanceProfiles[stud?.rollNo || ""] ||
                    "average";
                const gradeOptions = data.gradeDistribution[profile];
                const selectedGrade =
                    gradeOptions[
                        Math.floor(Math.random() * gradeOptions.length)
                    ] || "C";

                const gradeToMarks: Record<string, number> = {
                    A: 92 + Math.random() * 8,
                    "A-": 85 + Math.random() * 7,
                    B: 75 + Math.random() * 10,
                    "B-": 68 + Math.random() * 7,
                    C: 58 + Math.random() * 10,
                    "C-": 50 + Math.random() * 8,
                    D: 40 + Math.random() * 10,
                    F: 20 + Math.random() * 20,
                };

                return {
                    enrollmentId: enr.id,
                    totalMarks: Number(gradeToMarks[selectedGrade]!.toFixed(2)),
                    grade: selectedGrade,
                };
            });

            await db.insert(grade).values(gradeValues);
            totalGrades += gradeValues.length;
        }

        console.log(
            `  ✓ ${semKey}: Created offerings with enrollments and grades`
        );
    }

    console.log(
        `✓ Created ${totalEnrollments} historical enrollments with ${totalGrades} grades`
    );
}

async function main() {
    console.log("🌱 Starting database seed...\n");

    try {
        const depts = await seedDepartments();
        const hods = await seedHODs(depts);
        const programs = await seedPrograms(depts);
        const advisors = await seedAdvisors(depts);
        const instructors = await seedInstructors(depts);
        const batches = await seedBatches(programs);
        const students = await seedStudents(batches, advisors, programs);
        const courses = await seedCourses(depts);
        await seedPrerequisites(courses);
        const semesters = await seedSemesters();
        const classrooms = await seedClassrooms();
        const timeSlots = await seedTimeSlots();
        const questions = await seedFeedbackQuestions();

        await seedHistoricalOfferings(
            courses,
            semesters,
            instructors,
            batches,
            programs,
            students
        );

        const offerings = await seedCourseOfferings(
            courses,
            semesters,
            instructors,
            batches,
            programs
        );
        const enrollments = await seedEnrollments(students, offerings, batches);
        const templates = await seedAssessmentTemplates(offerings);
        const assessments = await seedAssessments(enrollments, templates);
        await seedAttendance(enrollments);
        await seedSchedules(offerings, timeSlots, classrooms);
        await seedCourseFeedback(enrollments, questions);

        console.log("\n✅ Database seeding completed successfully!");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        throw error;
    }
}

main()
    .catch((error) => {
        console.error("Fatal error:", error);
        process.exit(1);
    })
    .finally(() => {
        process.exit(0);
    });
