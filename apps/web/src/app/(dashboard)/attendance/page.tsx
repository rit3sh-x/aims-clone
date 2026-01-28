import { requireInstructor } from "@/lib/auth-utils";

const Page = async () => {
    await requireInstructor();

    return <div />;
};

export default Page;
