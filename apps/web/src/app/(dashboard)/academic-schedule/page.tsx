import { requireAdmin } from "@/lib/auth-utils";
import { AdminScheduleView } from "@/modules/schedule/ui/views/admin-schedule-view";

const Page = async () => {
    await requireAdmin();

    return <AdminScheduleView />;
};

export default Page;
