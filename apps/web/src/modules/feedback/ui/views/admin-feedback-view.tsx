import { Suspense } from "react";
import {
    QuestionsListSkeleton,
    QuestionsList,
} from "../components/questions-list";

export const AdminFeedbackView = () => {
    return (
        <Suspense fallback={<QuestionsListSkeleton />}>
            <QuestionsList />
        </Suspense>
    );
};
