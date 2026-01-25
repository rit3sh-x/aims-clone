import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    getStudentByIdSchema,
    listStudentsInputSchema,
} from "../schema";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";
import {
    batch,
    db,
    department,
    program,
    student,
    user,
} from "@workspace/db";
import { TRPCError } from "@trpc/server";

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
});
