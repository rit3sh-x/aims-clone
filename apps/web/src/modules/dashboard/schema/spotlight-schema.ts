import { z } from "zod/v4";

export const spotlightSearchSchema = z.object({
    search: z.string().trim().default("").catch(""),
});
