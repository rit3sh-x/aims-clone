import { createTRPCRouter } from "@workspace/api/init";
import { offeringManagement } from "./procedures/offering";
import { scheduleViewer } from "./procedures/schedule";
import { enrollmentManagement } from "./procedures/enrollment";
import { assessmentManagement } from "./procedures/assessment";
import { courseManagement } from "./procedures/course";
import { gradeManagement } from "./procedures/grade";
import { attendanceManagement } from "./procedures/attendance";
import { feedbackManagement } from "./procedures/feedback";
import { batchManagement } from "./procedures/batch";
import { instructorManagement } from "./procedures/instructor";

export const instructorRouter = createTRPCRouter({
    offering: offeringManagement,
    schedule: scheduleViewer,
    enrollment: enrollmentManagement,
    assessment: assessmentManagement,
    course: courseManagement,
    grade: gradeManagement,
    attendance: attendanceManagement,
    feedback: feedbackManagement,
    batch: batchManagement,
    instructor: instructorManagement,
});
