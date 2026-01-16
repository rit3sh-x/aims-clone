import { InferSelectModel } from "drizzle-orm";
import { semester } from "@workspace/db";

export type Semester = InferSelectModel<typeof semester>;
