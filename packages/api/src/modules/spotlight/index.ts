import { createTRPCRouter, protectedProcedure } from "../../init";
import {
    spotlightInputSchema,
    spotlightOutputSchema,
    SpotlightResult,
} from "./schema";
import {
    searchForAdmin,
    searchForAdvisor,
    searchForHod,
    searchForInstructor,
    searchForStudent,
} from "./utils";

export const spotlightRouter = createTRPCRouter({
    spotlightSearch: protectedProcedure
        .input(spotlightInputSchema)
        .output(spotlightOutputSchema)
        .query(async ({ ctx, input }) => {
            const { search } = input;
            const { user: currentUser } = ctx.session;
            const results: SpotlightResult = [];

            try {
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
                    case "ADVISOR":
                        await searchForAdvisor(search, results, currentUser.id);
                        break;
                    case "HOD":
                        await searchForHod(search, results, currentUser.id);
                        break;
                    case "STUDENT":
                        await searchForStudent(search, results, currentUser.id);
                        break;
                }

                return results;
            } catch (error) {
                console.error("Spotlight search error:", error);
                return [];
            }
        }),
});
