import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    getDepartmentByIdInputSchema,
    listDepartmentFacultyInputSchema,
    listDepartmentsInputSchema,
} from "../schema";
import { db, department, instructor, user } from "@workspace/db";
import { and, asc, desc, eq, ilike, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const departmentManagement = createTRPCRouter({
    list: adminProcedure
        .input(listDepartmentsInputSchema)
        .query(async ({ input }) => {
            const { search } = input;
            const departments = await db.query.department.findMany({
                where: search
                    ? or(
                          ilike(department.name, `%${search}%`),
                          ilike(department.code, `%${search}%`)
                      )
                    : undefined,
                orderBy: [asc(department.code)],
            });

            return departments;
        }),

    listFaculty: adminProcedure
        .input(listDepartmentFacultyInputSchema)
        .query(async ({ input }) => {
            const { departmentId, search, cursor, pageSize } = input;

            const conditions = [];

            if (departmentId) {
                conditions.push(eq(instructor.departmentId, departmentId));
            }

            if (search) {
                conditions.push(
                    or(
                        ilike(user.name, `%${search}%`),
                        ilike(user.email, `%${search}%`),
                        ilike(instructor.designation, `%${search}%`)
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
                })
                .from(instructor)
                .innerJoin(user, eq(instructor.userId, user.id))
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
        .input(getDepartmentByIdInputSchema)
        .query(async ({ input }) => {
            const { id } = input;
            let currentDepartment = await db.query.department.findFirst({
                where: eq(department.id, id),
                with: {
                    programs: true,
                },
            });

            if (!currentDepartment) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No such department found",
                });
            }

            const programs = currentDepartment.programs.filter(Boolean) ?? [];

            currentDepartment = {
                ...currentDepartment,
                programs,
            };

            return currentDepartment;
        }),
});
