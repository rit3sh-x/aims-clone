import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    createScheduleInputSchema,
    deleteScheduleInputSchema,
    getScheduleByIdInputSchema,
    listSchedulesInputSchema,
    updateScheduleInputSchema,
    createTimeSlotInputSchema,
    listTimeSlotsInputSchema,
    deleteTimeSlotInputSchema,
    createManySchedulesInputSchema,
} from "../schema";
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
import { and, desc, eq, inArray, lt, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const scheduleManagement = createTRPCRouter({
    listSchedules: adminProcedure
        .input(listSchedulesInputSchema)
        .query(async ({ input }) => {
            const { pageSize, cursor, offeringId, roomCode, dayOfWeek } = input;

            const conditions = [];

            if (offeringId) {
                conditions.push(eq(schedule.offeringId, offeringId));
            }

            if (roomCode) {
                conditions.push(eq(classroom.room, roomCode));
            }

            if (dayOfWeek !== undefined) {
                conditions.push(eq(timeSlot.dayOfWeek, dayOfWeek));
            }

            if (cursor) {
                conditions.push(
                    or(
                        lt(schedule.createdAt, cursor.createdAt),
                        and(
                            eq(schedule.createdAt, cursor.createdAt),
                            lt(schedule.id, cursor.id)
                        )
                    )
                );
            }

            const where = conditions.length ? and(...conditions) : undefined;

            const rows = await db
                .select({
                    schedule,
                    timeSlot,
                    classroom,
                    courseOffering,
                    course,
                    semester,
                })
                .from(schedule)
                .innerJoin(timeSlot, eq(schedule.timeSlotId, timeSlot.id))
                .innerJoin(classroom, eq(schedule.classroomId, classroom.id))
                .innerJoin(courseOffering, eq(schedule.offeringId, courseOffering.id))
                .innerJoin(course, eq(courseOffering.courseId, course.id))
                .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
                .where(where)
                .orderBy(desc(schedule.createdAt), desc(schedule.id))
                .limit(pageSize + 1);

            const hasNextPage = rows.length > pageSize;
            const schedules = hasNextPage ? rows.slice(0, pageSize) : rows;

            const nextCursor = hasNextPage
                ? {
                      createdAt: schedules[schedules.length - 1]!.schedule.createdAt,
                      id: schedules[schedules.length - 1]!.schedule.id,
                  }
                : null;

            return { schedules, nextCursor, hasNextPage };
        }),

    getSchedule: adminProcedure
        .input(getScheduleByIdInputSchema)
        .query(async ({ input }) => {
            const result = await db
                .select({
                    schedule,
                    timeSlot,
                    classroom,
                    courseOffering,
                    course,
                    semester,
                })
                .from(schedule)
                .innerJoin(timeSlot, eq(schedule.timeSlotId, timeSlot.id))
                .innerJoin(classroom, eq(schedule.classroomId, classroom.id))
                .innerJoin(courseOffering, eq(schedule.offeringId, courseOffering.id))
                .innerJoin(course, eq(courseOffering.courseId, course.id))
                .innerJoin(semester, eq(courseOffering.semesterId, semester.id))
                .where(eq(schedule.id, input.id))
                .limit(1)
                .then((r) => r[0]);

            if (!result) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Schedule not found",
                });
            }

            return result;
        }),

    getOfferingSchedule: adminProcedure
        .input(getScheduleByIdInputSchema)
        .query(async ({ input }) => {
            const offering = await db.query.courseOffering.findFirst({
                where: eq(courseOffering.id, input.id),
            });

            if (!offering) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Course offering not found",
                });
            }

            const schedules = await db
                .select({
                    schedule,
                    timeSlot,
                    classroom,
                })
                .from(schedule)
                .innerJoin(timeSlot, eq(schedule.timeSlotId, timeSlot.id))
                .innerJoin(classroom, eq(schedule.classroomId, classroom.id))
                .where(eq(schedule.offeringId, input.id))
                .orderBy(timeSlot.dayOfWeek);

            return schedules;
        }),

    createSchedule: adminProcedure
        .input(createScheduleInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { offeringId, roomCode, timeSlotId, effectiveFrom, effectiveTo } = input;

            return await db.transaction(async (tx) => {
                const offering = await tx.query.courseOffering.findFirst({
                    where: eq(courseOffering.id, offeringId),
                });

                if (!offering) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Course offering not found",
                    });
                }

                const classroomRecord = await tx.query.classroom.findFirst({
                    where: eq(classroom.room, roomCode),
                });

                if (!classroomRecord) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: `Classroom '${roomCode}' not found`,
                    });
                }

                const timeSlotRecord = await tx.query.timeSlot.findFirst({
                    where: eq(timeSlot.id, timeSlotId),
                });

                if (!timeSlotRecord) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Time slot not found",
                    });
                }

                const classroomConflict = await tx.query.schedule.findFirst({
                    where: and(
                        eq(schedule.classroomId, classroomRecord.id),
                        eq(schedule.timeSlotId, timeSlotId)
                    ),
                });

                if (classroomConflict) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "Classroom is already booked for this time slot",
                    });
                }

                const offeringConflict = await tx.query.schedule.findFirst({
                    where: and(
                        eq(schedule.offeringId, offeringId),
                        eq(schedule.timeSlotId, timeSlotId)
                    ),
                });

                if (offeringConflict) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "Course offering already has a class at this time slot",
                    });
                }

                const [created] = await tx
                    .insert(schedule)
                    .values({
                        offeringId,
                        classroomId: classroomRecord.id,
                        timeSlotId,
                        effectiveFrom,
                        effectiveTo,
                    })
                    .returning();

                if (!created) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create schedule",
                    });
                }

                await logAuditEvent({
                    userId: ctx.session.user.id,
                    action: "CREATE",
                    entityType: "SCHEDULE",
                    entityId: created.id,
                    after: created,
                });

                return created;
            });
        }),

    updateSchedule: adminProcedure
        .input(updateScheduleInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { id, roomCode, ...restData } = input;

            return await db.transaction(async (tx) => {
                const before = await tx.query.schedule.findFirst({
                    where: eq(schedule.id, id),
                });

                if (!before) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Schedule not found",
                    });
                }

                let resolvedClassroomId: string | undefined;
                if (roomCode) {
                    const classroomRecord = await tx.query.classroom.findFirst({
                        where: eq(classroom.room, roomCode),
                    });

                    if (!classroomRecord) {
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: `Classroom '${roomCode}' not found`,
                        });
                    }
                    resolvedClassroomId = classroomRecord.id;
                }

                const newClassroomId = resolvedClassroomId ?? before.classroomId;
                const newTimeSlotId = restData.timeSlotId ?? before.timeSlotId;
                const newOfferingId = restData.offeringId ?? before.offeringId;

                if (restData.timeSlotId && restData.timeSlotId !== before.timeSlotId) {
                    const timeSlotRecord = await tx.query.timeSlot.findFirst({
                        where: eq(timeSlot.id, restData.timeSlotId),
                    });

                    if (!timeSlotRecord) {
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: "Time slot not found",
                        });
                    }
                }

                if (resolvedClassroomId || restData.timeSlotId) {
                    const classroomConflict = await tx.query.schedule.findFirst({
                        where: and(
                            eq(schedule.classroomId, newClassroomId),
                            eq(schedule.timeSlotId, newTimeSlotId),
                            sql`${schedule.id} != ${id}`
                        ),
                    });

                    if (classroomConflict) {
                        throw new TRPCError({
                            code: "CONFLICT",
                            message: "Classroom is already booked for this time slot",
                        });
                    }
                }

                if (restData.offeringId || restData.timeSlotId) {
                    const offeringConflict = await tx.query.schedule.findFirst({
                        where: and(
                            eq(schedule.offeringId, newOfferingId),
                            eq(schedule.timeSlotId, newTimeSlotId),
                            sql`${schedule.id} != ${id}`
                        ),
                    });

                    if (offeringConflict) {
                        throw new TRPCError({
                            code: "CONFLICT",
                            message: "Course offering already has a class at this time slot",
                        });
                    }
                }

                const updateData = {
                    ...restData,
                    ...(resolvedClassroomId && { classroomId: resolvedClassroomId }),
                };

                const [after] = await tx
                    .update(schedule)
                    .set(updateData)
                    .where(eq(schedule.id, id))
                    .returning();

                if (!after) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to update schedule",
                    });
                }

                await logAuditEvent({
                    userId: ctx.session.user.id,
                    action: "UPDATE",
                    entityType: "SCHEDULE",
                    entityId: id,
                    before,
                    after,
                });

                return after;
            });
        }),

    deleteSchedule: adminProcedure
        .input(deleteScheduleInputSchema)
        .mutation(async ({ input, ctx }) => {
            return await db.transaction(async (tx) => {
                const before = await tx.query.schedule.findFirst({
                    where: eq(schedule.id, input.id),
                });

                if (!before) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Schedule not found",
                    });
                }

                await tx.delete(schedule).where(eq(schedule.id, input.id));

                await logAuditEvent({
                    userId: ctx.session.user.id,
                    action: "DELETE",
                    entityType: "SCHEDULE",
                    entityId: input.id,
                    before,
                });

                return { success: true };
            });
        }),

    listTimeSlots: adminProcedure
        .input(listTimeSlotsInputSchema)
        .query(async ({ input }) => {
            const { dayOfWeek } = input;

            const conditions = [];

            if (dayOfWeek !== undefined) {
                conditions.push(eq(timeSlot.dayOfWeek, dayOfWeek));
            }

            const where = conditions.length ? and(...conditions) : undefined;

            return await db
                .select()
                .from(timeSlot)
                .where(where)
                .orderBy(timeSlot.dayOfWeek, timeSlot.sessionType);
        }),

    createTimeSlot: adminProcedure
        .input(createTimeSlotInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { dayOfWeek, sessionType, theoryPeriod, tutorialPeriod, labPeriod } = input;

            return await db.transaction(async (tx) => {
                const conditions = [
                    eq(timeSlot.dayOfWeek, dayOfWeek),
                    eq(timeSlot.sessionType, sessionType),
                ];

                if (sessionType === "THEORY" && theoryPeriod) {
                    conditions.push(eq(timeSlot.theoryPeriod, theoryPeriod));
                } else if (sessionType === "TUTORIAL" && tutorialPeriod) {
                    conditions.push(eq(timeSlot.tutorialPeriod, tutorialPeriod));
                } else if (sessionType === "LAB" && labPeriod) {
                    conditions.push(eq(timeSlot.labPeriod, labPeriod));
                }

                const existing = await tx.query.timeSlot.findFirst({
                    where: and(...conditions),
                });

                if (existing) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "Time slot already exists",
                    });
                }

                const [created] = await tx
                    .insert(timeSlot)
                    .values({
                        dayOfWeek,
                        sessionType,
                        theoryPeriod: sessionType === "THEORY" ? theoryPeriod : null,
                        tutorialPeriod: sessionType === "TUTORIAL" ? tutorialPeriod : null,
                        labPeriod: sessionType === "LAB" ? labPeriod : null,
                    })
                    .returning();

                if (!created) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create time slot",
                    });
                }

                await logAuditEvent({
                    userId: ctx.session.user.id,
                    action: "CREATE",
                    entityType: "TIME_SLOT",
                    entityId: created.id,
                    after: created,
                });

                return created;
            });
        }),

    deleteTimeSlot: adminProcedure
        .input(deleteTimeSlotInputSchema)
        .mutation(async ({ input, ctx }) => {
            return await db.transaction(async (tx) => {
                const before = await tx.query.timeSlot.findFirst({
                    where: eq(timeSlot.id, input.id),
                });

                if (!before) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Time slot not found",
                    });
                }

                const inUse = await tx.query.schedule.findFirst({
                    where: eq(schedule.timeSlotId, input.id),
                });

                if (inUse) {
                    throw new TRPCError({
                        code: "PRECONDITION_FAILED",
                        message: "Cannot delete time slot that is in use by schedules",
                    });
                }

                await tx.delete(timeSlot).where(eq(timeSlot.id, input.id));

                await logAuditEvent({
                    userId: ctx.session.user.id,
                    action: "DELETE",
                    entityType: "TIME_SLOT",
                    entityId: input.id,
                    before,
                });

                return { success: true };
            });
        }),

    createBulkSchedules: adminProcedure
        .input(createManySchedulesInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { schedules: scheduleInputs } = input;

            return await db.transaction(async (tx) => {
                const offeringIds = [...new Set(scheduleInputs.map((s) => s.offeringId))];
                const roomCodes = [...new Set(scheduleInputs.map((s) => s.roomCode))];
                const timeSlotIds = [...new Set(scheduleInputs.map((s) => s.timeSlotId))];

                const [offerings, classrooms, timeSlots] = await Promise.all([
                    tx.query.courseOffering.findMany({
                        where: inArray(courseOffering.id, offeringIds),
                    }),
                    tx.query.classroom.findMany({
                        where: inArray(classroom.room, roomCodes),
                    }),
                    tx.query.timeSlot.findMany({
                        where: inArray(timeSlot.id, timeSlotIds),
                    }),
                ]);

                const offeringMap = new Map(offerings.map((o) => [o.id, o]));
                const classroomByRoomCode = new Map(classrooms.map((c) => [c.room, c]));
                const timeSlotMap = new Map(timeSlots.map((t) => [t.id, t]));

                const classroomIds = classrooms.map((c) => c.id);

                const existingSchedules =
                    classroomIds.length > 0
                        ? await tx
                              .select()
                              .from(schedule)
                              .where(
                                  or(
                                      and(
                                          inArray(schedule.classroomId, classroomIds),
                                          inArray(schedule.timeSlotId, timeSlotIds)
                                      ),
                                      and(
                                          inArray(schedule.offeringId, offeringIds),
                                          inArray(schedule.timeSlotId, timeSlotIds)
                                      )
                                  )
                              )
                        : [];

                const existingClassroomSlots = new Set(
                    existingSchedules.map((s) => `${s.classroomId}-${s.timeSlotId}`)
                );
                const existingOfferingSlots = new Set(
                    existingSchedules.map((s) => `${s.offeringId}-${s.timeSlotId}`)
                );

                const batchClassroomSlots = new Set<string>();
                const batchOfferingSlots = new Set<string>();

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

                for (const scheduleInput of scheduleInputs) {
                    const { offeringId, roomCode, timeSlotId } = scheduleInput;

                    if (!offeringMap.has(offeringId)) {
                        failed.push({
                            input: scheduleInput,
                            reason: `Course offering not found: ${offeringId}`,
                        });
                        continue;
                    }

                    const classroomRecord = classroomByRoomCode.get(roomCode);
                    if (!classroomRecord) {
                        failed.push({
                            input: scheduleInput,
                            reason: `Classroom '${roomCode}' not found`,
                        });
                        continue;
                    }

                    if (!timeSlotMap.has(timeSlotId)) {
                        failed.push({
                            input: scheduleInput,
                            reason: `Time slot not found: ${timeSlotId}`,
                        });
                        continue;
                    }

                    const classroomSlotKey = `${classroomRecord.id}-${timeSlotId}`;
                    const offeringSlotKey = `${offeringId}-${timeSlotId}`;

                    if (existingClassroomSlots.has(classroomSlotKey)) {
                        failed.push({
                            input: scheduleInput,
                            reason: `Classroom '${roomCode}' is already booked for this time slot`,
                        });
                        continue;
                    }

                    if (existingOfferingSlots.has(offeringSlotKey)) {
                        failed.push({
                            input: scheduleInput,
                            reason: "Course offering already has a class at this time slot",
                        });
                        continue;
                    }

                    if (batchClassroomSlots.has(classroomSlotKey)) {
                        failed.push({
                            input: scheduleInput,
                            reason: `Duplicate classroom assignment in batch for '${roomCode}' at this time slot`,
                        });
                        continue;
                    }

                    if (batchOfferingSlots.has(offeringSlotKey)) {
                        failed.push({
                            input: scheduleInput,
                            reason: "Duplicate offering assignment in batch for this time slot",
                        });
                        continue;
                    }

                    batchClassroomSlots.add(classroomSlotKey);
                    batchOfferingSlots.add(offeringSlotKey);

                    validSchedules.push({
                        offeringId,
                        classroomId: classroomRecord.id,
                        timeSlotId,
                        effectiveFrom: scheduleInput.effectiveFrom,
                        effectiveTo: scheduleInput.effectiveTo,
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