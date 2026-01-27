import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import { createBulkSchedulesInputSchema } from "../schema";
import {
    classroom,
    course,
    courseOffering,
    db,
    logAuditEvent,
    schedule,
    semester,
    timeSlot,
} from "@workspace/db";
import { and, eq, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { checkDateRangeOverlap } from "../utils";

export const scheduleManagement = createTRPCRouter({
    createBulkSchedules: adminProcedure
        .input(createBulkSchedulesInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { schedules: scheduleInputs } = input;

            return await db.transaction(async (tx) => {
                const ongoingSemester = await tx.query.semester.findFirst({
                    where: eq(semester.status, "ONGOING"),
                });

                if (!ongoingSemester) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "No ongoing semester found",
                    });
                }

                const courseCodes = [
                    ...new Set(scheduleInputs.map((s) => s.courseCode)),
                ];
                const roomCodes = [
                    ...new Set(scheduleInputs.map((s) => s.roomCode)),
                ];

                const [courses, classrooms] = await Promise.all([
                    tx.query.course.findMany({
                        where: inArray(course.code, courseCodes),
                    }),
                    tx.query.classroom.findMany({
                        where: inArray(classroom.room, roomCodes),
                    }),
                ]);

                const courseMap = new Map(courses.map((c) => [c.code, c]));
                const classroomMap = new Map(
                    classrooms.map((c) => [c.room, c])
                );

                const courseIds = courses.map((c) => c.id);
                const offerings = await tx.query.courseOffering.findMany({
                    where: and(
                        inArray(courseOffering.courseId, courseIds),
                        eq(courseOffering.semesterId, ongoingSemester.id)
                    ),
                });

                const offeringMap = new Map(
                    offerings.map((o) => [o.courseId, o])
                );

                const allTimeSlots = await tx.query.timeSlot.findMany();

                const timeSlotLookup = new Map<
                    string,
                    (typeof allTimeSlots)[0]
                >();
                allTimeSlots.forEach((slot) => {
                    let periodValue: string | null = null;
                    if (slot.sessionType === "THEORY" && slot.theoryPeriod) {
                        periodValue = slot.theoryPeriod;
                    } else if (
                        slot.sessionType === "TUTORIAL" &&
                        slot.tutorialPeriod
                    ) {
                        periodValue = slot.tutorialPeriod;
                    } else if (slot.sessionType === "LAB" && slot.labPeriod) {
                        periodValue = slot.labPeriod;
                    }

                    if (periodValue) {
                        const key = `${slot.dayOfWeek}-${slot.sessionType}-${periodValue}`;
                        timeSlotLookup.set(key, slot);
                    }
                });

                const offeringIds = offerings.map((o) => o.id);
                const classroomIds = classrooms.map((c) => c.id);

                const existingSchedules =
                    offeringIds.length > 0 && classroomIds.length > 0
                        ? await tx
                              .select()
                              .from(schedule)
                              .where(
                                  or(
                                      inArray(
                                          schedule.classroomId,
                                          classroomIds
                                      ),
                                      inArray(schedule.offeringId, offeringIds)
                                  )
                              )
                        : [];

                const existingByClassroomTime = new Map<
                    string,
                    typeof existingSchedules
                >();
                const existingByOfferingTime = new Map<
                    string,
                    typeof existingSchedules
                >();

                existingSchedules.forEach((s) => {
                    const classroomKey = `${s.classroomId}-${s.timeSlotId}`;
                    const offeringKey = `${s.offeringId}-${s.timeSlotId}`;

                    if (!existingByClassroomTime.has(classroomKey)) {
                        existingByClassroomTime.set(classroomKey, []);
                    }
                    existingByClassroomTime.get(classroomKey)!.push(s);

                    if (!existingByOfferingTime.has(offeringKey)) {
                        existingByOfferingTime.set(offeringKey, []);
                    }
                    existingByOfferingTime.get(offeringKey)!.push(s);
                });

                const batchClassroomSlots = new Map<
                    string,
                    Array<{
                        effectiveFrom?: Date;
                        effectiveTo?: Date;
                        index: number;
                    }>
                >();
                const batchOfferingSlots = new Map<
                    string,
                    Array<{
                        effectiveFrom?: Date;
                        effectiveTo?: Date;
                        index: number;
                    }>
                >();

                const validSchedules: Array<{
                    offeringId: string;
                    classroomId: string;
                    timeSlotId: string;
                    effectiveFrom?: Date;
                    effectiveTo?: Date;
                }> = [];

                const failed: Array<{
                    input: (typeof scheduleInputs)[number];
                    reason: string;
                }> = [];

                for (let i = 0; i < scheduleInputs.length; i++) {
                    const scheduleInput = scheduleInputs[i]!;
                    const {
                        courseCode,
                        roomCode,
                        dayOfWeek,
                        sessionType,
                        period,
                        effectiveFrom,
                        effectiveTo,
                    } = scheduleInput;

                    const courseRecord = courseMap.get(courseCode);
                    if (!courseRecord) {
                        failed.push({
                            input: scheduleInput,
                            reason: `Course '${courseCode}' not found`,
                        });
                        continue;
                    }

                    const offering = offeringMap.get(courseRecord.id);
                    if (!offering) {
                        failed.push({
                            input: scheduleInput,
                            reason: `Course '${courseCode}' is not being offered in the ongoing semester`,
                        });
                        continue;
                    }

                    const classroomRecord = classroomMap.get(roomCode);
                    if (!classroomRecord) {
                        failed.push({
                            input: scheduleInput,
                            reason: `Classroom '${roomCode}' not found`,
                        });
                        continue;
                    }

                    const timeSlotKey = `${dayOfWeek}-${sessionType}-${period}`;
                    const timeSlotRecord = timeSlotLookup.get(timeSlotKey);

                    if (!timeSlotRecord) {
                        failed.push({
                            input: scheduleInput,
                            reason: `Time slot not found for ${dayOfWeek}, ${sessionType}, ${period}`,
                        });
                        continue;
                    }

                    const classroomSlotKey = `${classroomRecord.id}-${timeSlotRecord.id}`;
                    const offeringSlotKey = `${offering.id}-${timeSlotRecord.id}`;

                    const existingClassroomConflicts =
                        existingByClassroomTime.get(classroomSlotKey) || [];
                    const hasClassroomConflict =
                        existingClassroomConflicts.some((existing) =>
                            checkDateRangeOverlap(
                                effectiveFrom,
                                effectiveTo,
                                existing.effectiveFrom ?? undefined,
                                existing.effectiveTo ?? undefined
                            )
                        );

                    if (hasClassroomConflict) {
                        failed.push({
                            input: scheduleInput,
                            reason: `Classroom '${roomCode}' is already booked for ${dayOfWeek}, ${sessionType}, ${period}`,
                        });
                        continue;
                    }

                    const existingOfferingConflicts =
                        existingByOfferingTime.get(offeringSlotKey) || [];
                    const hasOfferingConflict = existingOfferingConflicts.some(
                        (existing) =>
                            checkDateRangeOverlap(
                                effectiveFrom,
                                effectiveTo,
                                existing.effectiveFrom ?? undefined,
                                existing.effectiveTo ?? undefined
                            )
                    );

                    if (hasOfferingConflict) {
                        failed.push({
                            input: scheduleInput,
                            reason: `Course '${courseCode}' already has a class at ${dayOfWeek}, ${sessionType}, ${period}`,
                        });
                        continue;
                    }

                    const batchClassroomEntries =
                        batchClassroomSlots.get(classroomSlotKey) || [];
                    const hasBatchClassroomConflict =
                        batchClassroomEntries.some((entry) =>
                            checkDateRangeOverlap(
                                effectiveFrom,
                                effectiveTo,
                                entry.effectiveFrom,
                                entry.effectiveTo
                            )
                        );

                    if (hasBatchClassroomConflict) {
                        failed.push({
                            input: scheduleInput,
                            reason: `Duplicate classroom assignment in batch for '${roomCode}' at ${dayOfWeek}, ${sessionType}, ${period}`,
                        });
                        continue;
                    }

                    const batchOfferingEntries =
                        batchOfferingSlots.get(offeringSlotKey) || [];
                    const hasBatchOfferingConflict = batchOfferingEntries.some(
                        (entry) =>
                            checkDateRangeOverlap(
                                effectiveFrom,
                                effectiveTo,
                                entry.effectiveFrom,
                                entry.effectiveTo
                            )
                    );

                    if (hasBatchOfferingConflict) {
                        failed.push({
                            input: scheduleInput,
                            reason: `Duplicate course assignment in batch for '${courseCode}' at ${dayOfWeek}, ${sessionType}, ${period}`,
                        });
                        continue;
                    }

                    if (!batchClassroomSlots.has(classroomSlotKey)) {
                        batchClassroomSlots.set(classroomSlotKey, []);
                    }
                    batchClassroomSlots.get(classroomSlotKey)!.push({
                        effectiveFrom,
                        effectiveTo,
                        index: i,
                    });

                    if (!batchOfferingSlots.has(offeringSlotKey)) {
                        batchOfferingSlots.set(offeringSlotKey, []);
                    }
                    batchOfferingSlots.get(offeringSlotKey)!.push({
                        effectiveFrom,
                        effectiveTo,
                        index: i,
                    });

                    validSchedules.push({
                        offeringId: offering.id,
                        classroomId: classroomRecord.id,
                        timeSlotId: timeSlotRecord.id,
                        effectiveFrom,
                        effectiveTo,
                    });
                }

                if (validSchedules.length === 0) {
                    return {
                        created: [],
                        failed,
                        createdCount: 0,
                        failedCount: failed.length,
                    };
                }

                const createdSchedules = await tx
                    .insert(schedule)
                    .values(validSchedules)
                    .returning();

                await logAuditEvent({
                    userId: ctx.session.user.id,
                    action: "CREATE",
                    entityType: "SCHEDULE",
                    after: {
                        bulkOperation: true,
                        createdCount: createdSchedules.length,
                        failedCount: failed.length,
                        scheduleIds: createdSchedules.map((s) => s.id),
                    },
                });

                return {
                    created: createdSchedules,
                    failed,
                    createdCount: createdSchedules.length,
                    failedCount: failed.length,
                };
            });
        }),
});
