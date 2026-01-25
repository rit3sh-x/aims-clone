import { createTRPCRouter } from "@workspace/api/init";
import {
    getInstructorsByIdInputSchema,
    listInstructorsInputSchema,
} from "../schema";
import { adminProcedure } from "../middleware";
import { db, department, instructor, user } from "@workspace/db";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const instructorManagement = createTRPCRouter({
    list: adminProcedure
        .input(listInstructorsInputSchema)
        .query(async ({ input }) => {
            const { pageSize, cursor, departmentCode, search } = input;

            const conditions = [];

            if (departmentCode) {
                conditions.push(eq(department.code, departmentCode));
            }

            if (search) {
                conditions.push(
                    or(
                        ilike(user.name, `%${search}%`),
                        ilike(user.email, `%${search}%`)
                    )
                );
            }

            if (cursor) {
                conditions.push(
                    or(
                        lt(instructor.createdAt, cursor.createdAt),
                        and(
                            eq(instructor.createdAt, cursor.createdAt),
                            lt(instructor.id, cursor.id)
                        )
                    )
                );
            }

            const where = conditions.length ? and(...conditions) : undefined;

            const rows = await db
                .select({
                    instructor,
                    user,
                    department,
                })
                .from(instructor)
                .innerJoin(user, eq(instructor.userId, user.id))
                .innerJoin(
                    department,
                    eq(instructor.departmentId, department.id)
                )
                .where(where)
                .orderBy(desc(instructor.createdAt), desc(instructor.id))
                .limit(pageSize + 1);

            const hasNextPage = rows.length > pageSize;
            const items = hasNextPage ? rows.slice(0, pageSize) : rows;

            const nextCursor = hasNextPage
                ? {
                      createdAt: items[items.length - 1]!.instructor.createdAt,
                      id: items[items.length - 1]!.instructor.id,
                  }
                : null;

            return {
                items,
                nextCursor,
                hasNextPage,
            };
        }),

    getById: adminProcedure
        .input(getInstructorsByIdInputSchema)
        .query(async ({ input }) => {
            const { id } = input;

            const [uniqueInstructor] = await db
                .select({
                    instructor,
                    user,
                    department,
                })
                .from(instructor)
                .innerJoin(user, eq(instructor.userId, user.id))
                .innerJoin(
                    department,
                    eq(instructor.departmentId, department.id)
                )
                .where(eq(instructor.id, id))
                .limit(1);

            if (!uniqueInstructor) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Instructor not found",
                });
            }

            return uniqueInstructor;
        }),
});
