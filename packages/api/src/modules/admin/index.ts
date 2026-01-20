import { createTRPCRouter } from "@workspace/api/init";
import { userManagement } from "./procedures/users";
import { departmentManagement } from "./procedures/department";
import { programManagement } from "./procedures/program";
import { batchManagement } from "./procedures/batch";
import { studentManagement } from "./procedures/student";
import { instructorManagement } from "./procedures/instructor";
import { courseManagement } from "./procedures/course";
import { semesterManagement } from "./procedures/semester";
import { offeringManagement } from "./procedures/offering";
import { classroomManagement } from "./procedures/classroom";
import { logsViewer } from "./procedures/logs";

export const adminRouter = createTRPCRouter({
    user: userManagement,
    department: departmentManagement,
    program: programManagement,
    batch: batchManagement,
    student: studentManagement,
    instructor: instructorManagement,
    course: courseManagement,
    semester: semesterManagement,
    offering: offeringManagement,
    classroom: classroomManagement,
    logs: logsViewer,
});
