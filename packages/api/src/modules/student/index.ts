import { createTRPCRouter } from "@workspace/api/init";
import { offeringManagement } from "./procedures/offering";
import { scheduleViewer } from "./procedures/schedule";
import { selfManagement } from "./procedures/self";
import { attendanceViewer } from "./procedures/attendance";
import { feedbackManagement } from "./procedures/feedback";
import { courseManagement } from "./procedures/course";

export const studentRouter = createTRPCRouter({
    offering: offeringManagement,
    schedule: scheduleViewer,
    self: selfManagement,
    attendance: attendanceViewer,
    feedback: feedbackManagement,
    course: courseManagement,
});
