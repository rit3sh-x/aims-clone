import { UserRole } from "@workspace/db";
import { Suspense } from "react";
import {
    AdminChartInteractiveArea,
    AdminChartInteractiveAreaSkeleton,
} from "./admin";

interface ChartInteractiveAreaProps {
    role: UserRole;
}

export const ChartInteractiveArea = ({ role }: ChartInteractiveAreaProps) => {
    switch (role) {
        case "ADMIN":
            return (
                <Suspense fallback={<AdminChartInteractiveAreaSkeleton />}>
                    <AdminChartInteractiveArea />
                </Suspense>
            );
        default:
            return null;
    }
};
