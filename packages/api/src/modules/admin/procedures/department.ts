import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import {
    getDepartmentByIdInputSchema,
    listDepartmentsInputSchema,
    listDepartmentsOutputSchema,
    updateDepartmentInputSchema,
} from "../schema";
import { db, department, logAuditEvent } from "@workspace/db";
import { asc, eq, ilike, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const departmentManagement = createTRPCRouter({
    list: adminProcedure
        .input(listDepartmentsInputSchema)
        .output(listDepartmentsOutputSchema)
        .query(async ({ input }) => {
            const { search } = input;
            const departments = db.query.department.findMany({
                where: search
                    ? or(
                          ilike(department.name, `%${search}%`),
                          sql`CAST(${department.code} AS TEXT) ILIKE ${`%${search}%`}`
                      )
                    : undefined,
                orderBy: [asc(department.code)],
            });

            return departments;
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

    update: adminProcedure
        .input(updateDepartmentInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { user } = ctx.session;
            const { id, name } = input;
            const beforeDepartment = await db.query.department.findFirst({
                where: (d, { eq }) => eq(d.id, id),
            });

            if (!beforeDepartment) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Department not found",
                });
            }

            const [updated] = await db
                .update(department)
                .set({
                    name,
                })
                .where(eq(department.id, id))
                .returning();

            await logAuditEvent({
                userId: user.id,
                action: "UPDATE",
                entityType: "DEPARTMENT",
                entityId: id,
                after: updated,
                before: beforeDepartment,
            });

            return updated;
        }),
});
