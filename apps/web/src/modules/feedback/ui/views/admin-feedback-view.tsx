import { Suspense } from "react";
import {
    QuestionsListSkeleton,
    QuestionsList,
} from "../components/questions-list";

export const AdminFeedbackView = () => {
    return (
        <div className="h-full">
            <Suspense fallback={<QuestionsListSkeleton />}>
                <QuestionsList />
            </Suspense>
        </div>
    );
};
