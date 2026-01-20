import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    createSemesterInputSchema,
    endSemesterInputSchema,
    listSemestersInputSchema,
    startSemesterInputSchema,
    updateSemesterInputSchema,
} from "../schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { db, logAuditEvent, semester } from "@workspace/db";
import { TRPCError } from "@trpc/server";

export const semesterManagement = createTRPCRouter({
    list: adminProcedure
        .input(listSemestersInputSchema)
        .query(async ({ input }) => {
            const {
                status,
                year,
                page,
                pageSize,
                semester: chosenSemster,
            } = input;

            const limit = pageSize;
            const offset = (page - 1) * pageSize;

            const conditions = [];

            if (status) {
                conditions.push(eq(semester.status, status));
            }

            if (year) {
                conditions.push(eq(semester.year, year));
            }

            if (chosenSemster) {
                conditions.push(eq(semester.semester, chosenSemster));
            }

            const where = conditions.length ? and(...conditions) : undefined;

            const [items, total] = await Promise.all([
                db.query.semester.findMany({
                    where,
                    orderBy: [desc(semester.year), desc(semester.startDate)],
                    limit,
                    offset,
                }),

                db
                    .select({ count: sql<number>`count(*)` })
                    .from(semester)
                    .where(where)
                    .then((r) => r[0]?.count ?? 0),
            ]);

            return {
                items,
                meta: {
                    page,
                    pageSize: limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }),

    create: adminProcedure
        .input(createSemesterInputSchema)
        .mutation(async ({ input, ctx }) => {
            const {
                year,
                semester: term,
                name,
                startDate,
                endDate,
                enrollmentDeadline,
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

            const existingSameTerm = await db.query.semester.findFirst({
                where: and(
                    eq(semester.year, year),
                    eq(semester.semester, term)
                ),
            });

            if (existingSameTerm) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: `Semester ${term} ${year} already exists`,
                });
            }

            const overlapping = await db.query.semester.findFirst({
                where: sql`
                daterange(${semester.startDate}, ${semester.endDate}, '[]')
                && daterange(${startDate}, ${endDate}, '[]')
            `,
            });

            if (overlapping) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Semester dates overlap with an existing semester",
                });
            }

            const [created] = await db
                .insert(semester)
                .values({
                    id: crypto.randomUUID(),
                    year,
                    semester: term,
                    name,
                    startDate,
                    enrollmentDeadline,
                    endDate,
                    status: "UPCOMING",
                })
                .returning();

            if (!created) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create semester",
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
                action: "UPDATE",
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
            const { id, ...data } = input;

            const existing = await db.query.semester.findFirst({
                where: eq(semester.id, id),
            });

            if (!existing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Semester not found",
                });
            }

            if (existing.status !== "UPCOMING") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Only UPCOMING semesters can be edited",
                });
            }

            const [updated] = await db
                .update(semester)
                .set(data)
                .where(eq(semester.id, id))
                .returning();

            await logAuditEvent({
                userId: ctx.session.user.id,
                action: "UPDATE",
                entityType: "SEMESTER",
                entityId: id,
                before: existing,
                after: updated,
            });

            return updated;
        }),
});
