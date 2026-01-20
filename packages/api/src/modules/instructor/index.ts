import { createTRPCRouter } from "@workspace/api/init";
import { offeringManagement } from "./procedures/offering";
import { scheduleViewer } from "./procedures/schedule";
import { enrollmentManagement } from "./procedures/enrollment";

export const instructorRouter = createTRPCRouter({
    offering: offeringManagement,
    schedule: scheduleViewer,
    enrollment: enrollmentManagement,
});
