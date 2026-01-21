import { z } from "zod";

const spotlightItemSchema = z.object({
    field: z.string(),
    url: z.string(),
    param: z.string(),
});

export const spotlightOutputSchema = z.array(
    z.object({
        title: z.string(),
        items: z.array(spotlightItemSchema),
    })
);

export type SpotlightResult = z.infer<typeof spotlightOutputSchema>;

export const spotlightInputSchema = z.object({
    search: z.string().trim().min(1, "Search can't be empty."),
});
