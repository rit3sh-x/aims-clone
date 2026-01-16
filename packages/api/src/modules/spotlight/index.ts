import { createTRPCRouter, protectedProcedure } from "../../init";
import { db, semester } from "@workspace/db";
import {
    spotlightInputSchema,
    spotlightOutputSchema,
    SpotlightResult,
} from "./schema";
import {
    searchForAdmin,
    searchForBatchAdvisor,
    searchForInstructor,
    searchForStudent,
} from "./utils";
import { eq } from "drizzle-orm";

export const spotlightRouter = createTRPCRouter({
    spotlightSearch: protectedProcedure
        .input(spotlightInputSchema)
        .output(spotlightOutputSchema)
        .query(async ({ ctx, input }) => {
            const { search } = input;
            const { user: currentUser } = ctx.session;
            const results: SpotlightResult = [];

            try {
                const currentSemester = await db.query.semester.findFirst({
                    where: eq(semester.isCurrent, true),
                });

                if (!currentSemester) {
                    return [];
                }

                switch (currentUser.role) {
                    case "ADMIN":
                        await searchForAdmin(search, results);
                        break;
                    case "INSTRUCTOR":
                        await searchForInstructor(
                            search,
                            results,
                            currentUser.id
                        );
                        break;
                    case "BATCHADVISOR":
                        await searchForBatchAdvisor(
                            search,
                            results,
                            currentUser.id
                        );
                        break;
                    case "STUDENT":
                        await searchForStudent(
                            search,
                            results,
                            currentUser.id,
                            currentSemester
                        );
                        break;
                }

                return results;
            } catch (error) {
                console.error("Spotlight search error:", error);
                return [];
            }
        }),
});
