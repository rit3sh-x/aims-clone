import { z } from "zod";
import { MAX_FILE_SIZE } from "./utils";

export const imageUploadInput = z
    .instanceof(FormData)
    .transform((fd) => Object.fromEntries(fd.entries()))
    .pipe(
        z.object({
            image: z
                .instanceof(File)
                .refine((f) => f.size > 0, "File is empty")
                .refine((f) => f.size <= MAX_FILE_SIZE, "File must be < 5MB"),
        })
    );
