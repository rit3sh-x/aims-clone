import { createTRPCRouter } from "@workspace/api/init";
import { studentManagement } from "./procedures/student";

export const advisorRouter = createTRPCRouter({
    student: studentManagement,
});
