import { UserRole } from "@workspace/db";
import { AdminSectionCards, AdminSectionCardsSkeleton } from "./admin";
import { Suspense } from "react";

interface SectionCardsProps {
    role: UserRole;
}

export const SectionCards = ({ role }: SectionCardsProps) => {
    switch (role) {
        case "ADMIN":
            return (
                <Suspense fallback={<AdminSectionCardsSkeleton />}>
                    <AdminSectionCards />
                </Suspense>
            );
        default:
            return null;
    }
};
