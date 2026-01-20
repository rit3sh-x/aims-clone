import { z } from "zod";
import {
    DEFAULT_PAGE,
    LIST_DEFAULT_PAGE_SIZE,
    LIST_MAX_PAGE_SIZE,
    LIST_MIN_PAGE_SIZE,
} from "../constants";
import { enrollmentTypeEnum, semesterEnum } from "@workspace/db";

export const listOfferingsInputSchema = z.object({
    semesterId: z.string(),
    page: z.number().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
    pageSize: z
        .number()
        .min(LIST_MIN_PAGE_SIZE)
        .max(LIST_MAX_PAGE_SIZE)
        .default(LIST_DEFAULT_PAGE_SIZE),
});

export const enrollInputSchema = z.object({
    offeringId: z.string(),
    type: z.enum(enrollmentTypeEnum.enumValues),
});

export const dropInputSchema = z.object({
    enrollmentId: z.string(),
});

export const listScheduleInputSchema = z.object({
    semesterId: z.string(),
});

export const calendarViewInputSchema = z.object({
    semesterId: z.string(),
    courseId: z.string(),
});

// export const uploadFeeProofInputSchema = z
//     .instanceof(FormData)
//     .transform((fd) => Object.fromEntries(fd.entries()))
//     .pipe(
//         z.object({
//             year: z
//                 .string()
//                 .transform(Number)
//                 .refine((v) => !Number.isNaN(v), "Year must be a number")
//                 .refine((v) => v >= 2000 && v <= 2100, "Year out of range"),

//             semester: z
//                 .string()
//                 .transform((v) => v.toUpperCase())
//                 .pipe(z.enum(semesterEnum.enumValues)),

//             amount: z
//                 .string()
//                 .transform(Number)
//                 .refine((v) => !Number.isNaN(v), "Amount must be a number"),

//             transactionNo: z.string().min(1, "Transaction number is required"),

//             transactionDate: z.string().transform((v, ctx) => {
//                 const d = new Date(v);
//                 if (Number.isNaN(d.getTime())) {
//                     ctx.addIssue({
//                         code: "custom",
//                         message: "Invalid transaction date",
//                     });
//                     return z.NEVER;
//                 }
//                 return d;
//             }),
//             bank: z.string().min(1, "Bank name is required"),

//             transactionProof: z
//                 .instanceof(File)
//                 .refine((f) => f.size > 0, "File is empty")
//                 .refine((f) => f.size <= MAX_FILE_SIZE, "File must be < 5MB"),
//         })
//     );
