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
        <div className="max-w-7xl mx-auto w-full p-6">
            <Suspense fallback={<OfferingDetailsCardSkeleton />}>
                <OfferingDetailsCard offeringId={offeringId} />
            </Suspense>
        </div>
    );
};
