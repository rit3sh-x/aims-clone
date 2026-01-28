import { Suspense } from "react";
import {
    OfferingDetailsCard,
    OfferingDetailsCardSkeleton,
} from "../components/student/offering-details-card";

interface StudentOfferingIdViewProps {
    offeringId: string;
}

export const StudentOfferingIdView = ({
    offeringId,
}: StudentOfferingIdViewProps) => {
    return (
        <Suspense fallback={<OfferingDetailsCardSkeleton />}>
            <OfferingDetailsCard offeringId={offeringId} />
        </Suspense>
    );
};
