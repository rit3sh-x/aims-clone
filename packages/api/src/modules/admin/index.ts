import { createTRPCRouter } from "@workspace/api/init";
import { userManagement } from "./procedures/users";
import { departmentManagement } from "./procedures/department";
import { studentManagement } from "./procedures/student";
import { instructorManagement } from "./procedures/instructor";
import { courseManagement } from "./procedures/course";
import { semesterManagement } from "./procedures/semester";
import { offeringManagement } from "./procedures/offering";
import { classroomManagement } from "./procedures/classroom";
import { logsViewer } from "./procedures/logs";
import { hodManagement } from "./procedures/hod";
import { advisorManagement } from "./procedures/advisor";
import { scheduleManagement } from "./procedures/schedule";
import { feedbackManagement } from "./procedures/feedback";
import { metricsViewer } from "./procedures/metrics";

export const adminRouter = createTRPCRouter({
    user: userManagement,
    department: departmentManagement,
    student: studentManagement,
    instructor: instructorManagement,
    course: courseManagement,
    semester: semesterManagement,
    offering: offeringManagement,
    classroom: classroomManagement,
    logs: logsViewer,
    hod: hodManagement,
    advisor: advisorManagement,
    schedule: scheduleManagement,
    feedback: feedbackManagement,
    metrics: metricsViewer,
});
