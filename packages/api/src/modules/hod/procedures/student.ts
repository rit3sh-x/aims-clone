import { createTRPCRouter } from "@workspace/api/init";
import { hodProcedure } from "../middleware";
import { getStudentByIdSchema, listStudentsInputSchema } from "../schema";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";
import { batch, db, department, program, student, user } from "@workspace/db";
import { TRPCError } from "@trpc/server";

export const studentManagement = createTRPCRouter({
    list: hodProcedure
        .input(listStudentsInputSchema)
        .query(async ({ input, ctx }) => {
            const { departmentId } = ctx.hod;
            const { pageSize, cursor, search, year } = input;

            const conditions = [];

            conditions.push(eq(department.id, departmentId));
            conditions.push(eq(user.disabled, false));

            if (search) {
                conditions.push(ilike(student.rollNo, `%${search}%`));
            }

            if (year) {
                conditions.push(eq(batch.year, year));
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
                .where(and(...conditions))
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

    getOne: hodProcedure
        .input(getStudentByIdSchema)
        .query(async ({ input, ctx }) => {
            const { departmentId } = ctx.hod;
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
                .where(
                    and(
                        eq(student.id, id),
                        eq(department.id, departmentId),
                        eq(user.disabled, false)
                    )
                )
                .limit(1)
                .then((r) => r[0]);

            if (!result) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Student not found in your department",
                });
            }

            return result;
        }),
});
