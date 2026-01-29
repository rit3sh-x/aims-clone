import { createTRPCRouter } from "@workspace/api/init";
import { instructorProcedure } from "../middleware";
import { z } from "zod";
import { db, instructor, user } from "@workspace/db";
import { ilike, or, sql, ne } from "drizzle-orm";

export const instructorManagement = createTRPCRouter({
    search: instructorProcedure
        .input(
            z.object({
                search: z.string().min(1),
            })
        )
        .query(async ({ input, ctx }) => {
            const { search } = input;
            const currentInstructorId = ctx.instructor.id;

            const searchPattern = `%${search}%`;

            const instructors = await db
                .select({
                    id: instructor.id,
                    name: user.name,
                    email: user.email,
                    employeeId: instructor.employeeId,
                    designation: instructor.designation,
                })
                .from(instructor)
                .innerJoin(user, sql`${instructor.userId} = ${user.id}`)
                .where(
                    sql`${ne(instructor.id, currentInstructorId)} AND (${or(
                        ilike(user.name, searchPattern),
                        ilike(user.email, searchPattern),
                        ilike(instructor.employeeId, searchPattern)
                    )})`
                )
                .limit(3);

            return instructors;
        }),
});
