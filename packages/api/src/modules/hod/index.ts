import { createTRPCRouter } from "@workspace/api/init";
import { studentManagement } from "./procedures/student";
import { courseManagement } from "./procedures/course";
import { instructorManagement } from "./procedures/instructor";
import { offeringManagement } from "./procedures/offering";

export const hodRouter = createTRPCRouter({
    student: studentManagement,
    course: courseManagement,
    instructor: instructorManagement,
    offering: offeringManagement,
});
