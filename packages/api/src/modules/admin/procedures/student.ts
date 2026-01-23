import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    createManyStudentsInputSchema,
    getStudentByIdSchema,
    listStudentsInputSchema,
    updateStudentInputSchema,
} from "../schema";
import { and, desc, eq, ilike, inArray, lt, or } from "drizzle-orm";
import {
    account,
    batch,
    db,
    department,
    logAuditEvent,
    program,
    student,
    twoFactor,
    user,
} from "@workspace/db";
import { randomHex } from "../utils";
import { auth } from "@workspace/auth";
import { TRPCError } from "@trpc/server";
import pLimit from "p-limit";

export const studentManagement = createTRPCRouter({
    list: adminProcedure
        .input(listStudentsInputSchema)
        .query(async ({ input }) => {
            const {
                pageSize,
                cursor,
                departmentCode,
                programCode,
                search,
                year,
            } = input;

            const conditions = [];

            if (search) {
                conditions.push(ilike(student.rollNo, `%${search}%`));
            }

            if (year) {
                conditions.push(eq(batch.year, year));
            }

            if (programCode) {
                conditions.push(eq(program.code, programCode));
            }

            if (departmentCode) {
                conditions.push(eq(department.code, departmentCode));
            }

            conditions.push(eq(user.disabled, false));

            if (cursor) {
                conditions.push(
                    or(
                        lt(student.createdAt, cursor.createdAt),
                        and(
                            eq(student.createdAt, cursor.createdAt),
                            lt(student.id, cursor.id)
                        )
                    )
                );
            }

            const where = conditions.length ? and(...conditions) : undefined;

            const rows = await db
                .select({
                    student,
                    user,
                    batch,
                    program,
                    department,
                })
                .from(student)
                .innerJoin(user, eq(student.userId, user.id))
                .innerJoin(batch, eq(student.batchId, batch.id))
                .innerJoin(program, eq(batch.programId, program.id))
                .innerJoin(department, eq(program.departmentId, department.id))
                .where(where)
                .orderBy(desc(student.createdAt), desc(student.id))
                .limit(pageSize + 1);

            const hasNextPage = rows.length > pageSize;
            const students = hasNextPage ? rows.slice(0, pageSize) : rows;

            const nextCursor = hasNextPage
                ? {
                      createdAt:
                          students[students.length - 1]!.student.createdAt,
                      id: students[students.length - 1]!.student.id,
                  }
                : null;

            return {
                students,
                nextCursor,
                hasNextPage,
            };
        }),

    getOne: adminProcedure
        .input(getStudentByIdSchema)
        .query(async ({ input }) => {
            const { id } = input;

            const result = await db
                .select({
                    student,
                    user,
                    batch,
                    program,
                    department,
                })
                .from(student)
                .innerJoin(user, eq(student.userId, user.id))
                .innerJoin(batch, eq(student.batchId, batch.id))
                .innerJoin(program, eq(batch.programId, program.id))
                .innerJoin(department, eq(program.departmentId, department.id))
                .where(and(eq(student.id, id), eq(user.disabled, false)))
                .limit(1)
                .then((r) => r[0]);

            if (!result) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Student not found",
                });
            }

            return result;
        }),

    createMany: adminProcedure
        .input(createManyStudentsInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { user: currentUser } = ctx.session;

            return await db.transaction(async (tx) => {
                const programCodes = [
                    ...new Set(input.map((r) => r.programCode)),
                ];
                const years = [...new Set(input.map((r) => r.year))];
                const emails = input.map((r) => r.email.toLowerCase());
                const hashFn = (await auth.$context).password.hash;

                const [programs, existingUsers] = await Promise.all([
                    tx.query.program.findMany({
                        where: inArray(program.code, programCodes),
                    }),
                    tx.query.user.findMany({
                        where: inArray(user.email, emails),
                    }),
                ]);

                const programMap = new Map(programs.map((p) => [p.code, p.id]));
                const existingEmailSet = new Set(
                    existingUsers.map((u) => u.email)
                );

                const programIds = [...new Set(programs.map((p) => p.id))];
                const batches = await tx.query.batch.findMany({
                    where: and(
                        inArray(batch.programId, programIds),
                        inArray(batch.year, years)
                    ),
                });

                const batchMap = new Map(
                    batches.map((b) => [`${b.programId}-${b.year}`, b.id])
                );

                const seenEmails = new Set<string>();
                const validRows: Array<{
                    id: string;
                    row: (typeof input)[number];
                    email: string;
                    programId: string;
                    batchId: string;
                    password: string;
                }> = [];

                const failed: Array<{
                    row: (typeof input)[number];
                    reason: string;
                }> = [];

                for (const row of input) {
                    const email = row.email.toLowerCase();

                    if (seenEmails.has(email)) {
                        failed.push({
                            row,
                            reason: "Duplicate email in input",
                        });
                        continue;
                    }

                    seenEmails.add(email);

                    if (existingEmailSet.has(email)) {
                        failed.push({ row, reason: "User already exists" });
                        continue;
                    }

                    const programId = programMap.get(row.programCode);
                    if (!programId) {
                        failed.push({ row, reason: "Program not found" });
                        continue;
                    }

                    const batchId = batchMap.get(`${programId}-${row.year}`);
                    if (!batchId) {
                        failed.push({ row, reason: "Batch not found" });
                        continue;
                    }

                    validRows.push({
                        id: crypto.randomUUID(),
                        row,
                        email,
                        programId,
                        batchId,
                        password: randomHex(),
                    });
                }

                if (validRows.length === 0) {
                    return { created: [], failed };
                }

                const limit = pLimit(5);
                const hashedPasswords = await Promise.all(
                    validRows.map((v) => limit(() => hashFn(v.password)))
                );

                const passwordMap = new Map(
                    validRows.map((v, i) => [v.id, hashedPasswords[i]])
                );

                const userInserts = validRows.map((v) => ({
                    id: v.id,
                    email: v.email,
                    name: v.row.name,
                    role: "STUDENT" as const,
                    emailVerified: true,
                    twoFactorEnabled: true,
                }));

                await tx.insert(user).values(userInserts);

                const accountInserts = validRows.map((v) => ({
                    userId: v.id,
                    accountId: v.id,
                    providerId: "credential",
                    password: passwordMap.get(v.id)!,
                }));

                await tx.insert(account).values(accountInserts);

                const studentInserts = validRows.map((v) => ({
                    userId: v.id,
                    rollNo: v.row.rollNo,
                    batchId: v.batchId,
                    advisorId: v.row.advisorId,
                }));

                const createdStudents = await tx
                    .insert(student)
                    .values(studentInserts)
                    .returning();

                const twoFactorInserts = validRows.map((v) => ({
                    userId: v.id,
                    backupCodes: JSON.stringify([]),
                }));

                await tx.insert(twoFactor).values(twoFactorInserts);

                await logAuditEvent({
                    userId: currentUser.id,
                    action: "CREATE",
                    entityType: "STUDENT",
                    after: {
                        createdCount: createdStudents.length,
                        failedCount: failed.length,
                        studentIds: createdStudents.map((s) => s.id),
                    },
                });

                return {
                    created: createdStudents,
                    failed,
                };
            });
        }),

    update: adminProcedure
        .input(updateStudentInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { id, ...data } = input;

            const before = await db.query.student.findFirst({
                where: eq(student.id, id),
            });

            if (!before) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Student not found",
                });
            }

            const [after] = await db
                .update(student)
                .set(data)
                .where(eq(student.id, id))
                .returning();

            if (!after) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update student",
                });
            }

            await logAuditEvent({
                userId: ctx.session.user.id,
                action: "UPDATE",
                entityType: "STUDENT",
                entityId: id,
                before,
                after,
            });

            return after;
        }),
});
