import { createTRPCRouter } from "@workspace/api/init";
import { studentManagement } from "./procedures/student";
import { enrollmentManagement } from "./procedures/enrollment";

export const advisorRouter = createTRPCRouter({
    student: studentManagement,
    enrollment: enrollmentManagement,
});
