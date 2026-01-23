import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import { TRPCError } from "@trpc/server";
import { course, db, logAuditEvent } from "@workspace/db";
import { and, eq, desc } from "drizzle-orm";
import {
    proposeCourseInputSchema,
    listInstructorCoursesInputSchema,
} from "../schema";

export const courseManagement = createTRPCRouter({
    propose: instructorProcedure
        .input(proposeCourseInputSchema)
        .mutation(async ({ input, ctx }) => {
            const { instructor } = ctx;

            const [created] = await db
                .insert(course)
                .values({
                    ...input,
                    departmentId: instructor.departmentId,
                    status: "PROPOSED",
                })
                .returning();

            if (!created) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to propose course",
                });
            }

            await logAuditEvent({
                userId: ctx.session.user.id,
                action: "CREATE",
                entityType: "COURSE",
                entityId: created.id,
                after: created,
            });

            return created;
        }),

    list: instructorProcedure
        .input(listInstructorCoursesInputSchema)
        .query(async ({ input, ctx }) => {
            const { instructor } = ctx;
            const { status } = input;

            const conditions = [
                eq(course.departmentId, instructor.departmentId),
            ];

            if (status) {
                conditions.push(eq(course.status, status));
            }

            return db
                .select()
                .from(course)
                .where(and(...conditions))
                .orderBy(desc(course.createdAt));
        }),
});
