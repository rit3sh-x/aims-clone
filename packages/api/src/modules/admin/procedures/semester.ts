import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    createSemesterInputSchema,
    endSemesterInputSchema,
    listSemestersInputSchema,
    startSemesterInputSchema,
    updateSemesterInputSchema,
} from "../schema";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { db, logAuditEvent, semester } from "@workspace/db";
import { TRPCError } from "@trpc/server";
import { semesterOverlapCondition } from "../utils";

export const semesterManagement = createTRPCRouter({
    list: adminProcedure
        .input(listSemestersInputSchema)
        .query(async ({ input }) => {
            const {
                status,
                year,
                semester: chosenSemester,
                cursor,
                pageSize,
            } = input;

            const conditions = [];

            if (status) {
                conditions.push(eq(semester.status, status));
            }

            if (year) {
                conditions.push(eq(semester.year, year));
            }

            if (chosenSemester) {
                conditions.push(eq(semester.semester, chosenSemester));
            }

            if (cursor) {
                conditions.push(
                    or(
                        lt(semester.year, cursor.year),
                        and(
                            eq(semester.year, cursor.year),
                            or(
                                lt(semester.startDate, cursor.startDate),
                                and(
                                    eq(semester.startDate, cursor.startDate),
                                    lt(semester.id, cursor.id)
                                )
                            )
                        )
                    )
                );
            }

            const where = conditions.length ? and(...conditions) : undefined;

            const rows = await db.query.semester.findMany({
                where,
                orderBy: [
                    desc(semester.year),
                    desc(semester.startDate),
                    desc(semester.id),
                ],
                limit: pageSize + 1,
            });

            const hasNextPage = rows.length > pageSize;
            const items = hasNextPage ? rows.slice(0, pageSize) : rows;

            const nextCursor = hasNextPage
                ? {
                      year: items[items.length - 1]!.year,
                      startDate: items[items.length - 1]!.startDate,
                      id: items[items.length - 1]!.id,
                  }
                : null;

            return {
                items,
                nextCursor,
                hasNextPage,
            };
        }),

    create: adminProcedure
        .input(createSemesterInputSchema)
        .mutation(async ({ input, ctx }) => {
            const {
                year,
                semester: term,
                startDate,
                endDate,
                enrollmentDeadline,
                feedbackFormStartDate,
            } = input;

            if (startDate >= endDate) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "startDate must be before endDate",
                });
            }

            if (
                enrollmentDeadline < startDate ||
                enrollmentDeadline > endDate
            ) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "Enrollment deadline must be between startDate and endDate",
                });
            }

            return await db.transaction(async (tx) => {
                const overlapping = await tx.query.semester.findFirst({
                    where: semesterOverlapCondition(startDate, endDate),
                });

                if (overlapping) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message:
                            "Semester dates overlap with an existing semester",
                    });
                }

                const [created] = await tx
                    .insert(semester)
                    .values({
                        year,
                        semester: term,
                        startDate,
                        enrollmentDeadline,
                        endDate,
                        status: "UPCOMING",
                        feedbackFormStartDate,
                    })
                    .returning();

                if (!created) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: `Semester ${term} ${year} already exists`,
                    });
                }

                await logAuditEvent({
                    userId: ctx.session.user.id,
                    action: "CREATE",
                    entityType: "SEMESTER",
                    entityId: created.id,
                    after: created,
                });

                return created;
            });
        }),

    start: adminProcedure
        .input(startSemesterInputSchema)
        .mutation(async ({ input, ctx }) => {
            const existing = await db.query.semester.findFirst({
                where: eq(semester.id, input.id),
            });

            if (!existing || existing.status !== "UPCOMING") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Only UPCOMING semesters can be started",
                });
            }

            const [updated] = await db
                .update(semester)
                .set({ status: "ONGOING" })
                .where(eq(semester.id, input.id))
                .returning();

            await logAuditEvent({
                userId: ctx.session.user.id,
                action: "UPDATE",
                entityType: "SEMESTER",
                entityId: input.id,
                before: existing,
                after: updated,
            });

            return updated;
        }),

    end: adminProcedure
        .input(endSemesterInputSchema)
        .mutation(async ({ input, ctx }) => {
            const existing = await db.query.semester.findFirst({
                where: eq(semester.id, input.id),
            });

            if (!existing || existing.status !== "ONGOING") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Only ONGOING semesters can be ended",
                });
            }

            const [updated] = await db
                .update(semester)
                .set({ status: "COMPLETED" })
                .where(eq(semester.id, input.id))
                .returning();

            await logAuditEvent({
                userId: ctx.session.user.id,
                action: "CREATE",
                entityType: "SEMESTER",
                entityId: input.id,
                before: existing,
                after: updated,
            });

            return updated;
        }),

    update: adminProcedure
        .input(updateSemesterInputSchema)
        .mutation(async ({ input, ctx }) => {
            const {
                id,
                year,
                semester: term,
                startDate,
                endDate,
                enrollmentDeadline,
            } = input;

            return await db.transaction(async (tx) => {
                const existing = await tx.query.semester.findFirst({
                    where: eq(semester.id, id),
                });

                if (!existing) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Semester not found",
                    });
                }

                const nextStart = startDate ?? existing.startDate;
                const nextEnd = endDate ?? existing.endDate;
                const nextDeadline =
                    enrollmentDeadline ?? existing.enrollmentDeadline;

                if (nextStart >= nextEnd) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "startDate must be before endDate",
                    });
                }

                if (nextDeadline < nextStart || nextDeadline > nextEnd) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message:
                            "Enrollment deadline must be between startDate and endDate",
                    });
                }

                const overlapping = await tx.query.semester.findFirst({
                    where: semesterOverlapCondition(nextStart, nextEnd, id),
                });

                if (overlapping) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message:
                            "Semester dates overlap with an existing semester",
                    });
                }

                let updated;
                try {
                    [updated] = await tx
                        .update(semester)
                        .set({
                            ...(year && { year }),
                            ...(term && { semester: term }),
                            ...(startDate && { startDate }),
                            ...(endDate && { endDate }),
                            ...(enrollmentDeadline && {
                                enrollmentDeadline,
                            }),
                        })
                        .where(eq(semester.id, id))
                        .returning();
                } catch {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message:
                            "Semester with this year and term already exists",
                    });
                }

                await logAuditEvent({
                    userId: ctx.session.user.id,
                    action: "UPDATE",
                    entityType: "SEMESTER",
                    entityId: input.id,
                    before: existing,
                    after: updated,
                });

                return updated;
            });
        }),
});
