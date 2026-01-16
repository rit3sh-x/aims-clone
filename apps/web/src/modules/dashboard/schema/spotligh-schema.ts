import { z } from "zod/v4";

export const spotlightSearch = z.object({
    search: z.string().trim().default("").catch(""),
});
