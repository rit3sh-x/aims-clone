import { createTRPCRouter } from "@workspace/api/init";
import { offeringManagement } from "./procedures/offering";
import { scheduleViewer } from "./procedures/schedule";
import { selfManagement } from "./procedures/self";

export const studentRouter = createTRPCRouter({
    offering: offeringManagement,
    schedule: scheduleViewer,
    self: selfManagement,
});
