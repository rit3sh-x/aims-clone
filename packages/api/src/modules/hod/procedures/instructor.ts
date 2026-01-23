import { createTRPCRouter } from "@workspace/api/init";
import {
    getInstructorsByIdInputSchema,
    listInstructorsInputSchema,
} from "../schema";
import { hodProcedure } from "../middleware";
import { db, department, instructor, user } from "@workspace/db";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const instructorManagement = createTRPCRouter({
    list: hodProcedure
        .input(listInstructorsInputSchema)
        .query(async ({ input, ctx }) => {
            const { departmentId } = ctx.hod;
            const { pageSize, cursor, search } = input;

            const conditions = [];

            conditions.push(eq(instructor.departmentId, departmentId));

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
                .where(and(...conditions))
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

    getById: hodProcedure
        .input(getInstructorsByIdInputSchema)
        .query(async ({ input, ctx }) => {
            const { departmentId } = ctx.hod;
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
                .where(
                    and(
                        eq(instructor.id, id),
                        eq(instructor.departmentId, departmentId)
                    )
                )
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
