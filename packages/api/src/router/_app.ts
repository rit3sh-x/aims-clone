import { createTRPCRouter } from "../init";
import { spotlightRouter } from "../modules/spotlight";
import { userRouter } from "../modules/user";
import { adminRouter } from "../modules/admin";
import { advisorRouter } from "../modules/advisor";
import { instructorRouter } from "../modules/instructor";
import { studentRouter } from "../modules/student";
import { hodRouter } from "../modules/hod";

export const appRouter = createTRPCRouter({
    spotlight: spotlightRouter,
    user: userRouter,
    admin: adminRouter,
    hod: hodRouter,
    advisor: advisorRouter,
    instructor: instructorRouter,
    student: studentRouter,
});

export type AppRouter = typeof appRouter;
