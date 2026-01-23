import { createTRPCRouter } from "@workspace/api/init";
import { studentManagement } from "./procedures/student";
import { batchManagement } from "./procedures/batch";
import { courseManagement } from "./procedures/course";
import { instructorManagement } from "./procedures/instructor";
import { offeringManagement } from "./procedures/offering";
import { programManagement } from "./procedures/program";

export const hodRouter = createTRPCRouter({
    student: studentManagement,
    batch: batchManagement,
    course: courseManagement,
    instructor: instructorManagement,
    offering: offeringManagement,
    program: programManagement,
});
