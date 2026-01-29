"use client";

import { useOptimistic, useTransition, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Sortable, SortableItem } from "@/components/sortable";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { QuestionCard, QuestionCardSkeleton } from "./question-card";
import { QuestionType } from "../../constants";
import {
    useListFeedback,
    useCreateFeedback,
    useUpdateFeedback,
    useDeleteFeedback,
    useReorderFeedback,
} from "../../hooks/use-admin-feedback";

interface Question {
    id: string;
    questionText: string;
    questionType: QuestionType;
    isRequired: boolean;
    order: number;
}

type OptimisticAction =
    | { type: "reorder"; payload: Question[] }
    | { type: "update"; payload: { id: string; updates: Partial<Question> } }
    | { type: "delete"; payload: string }
    | { type: "add"; payload: Question };

function optimisticReducer(
    state: Question[],
    action: OptimisticAction
): Question[] {
    switch (action.type) {
        case "reorder":
            return action.payload.map((q, index) => ({
                ...q,
                order: index + 1,
            }));
        case "update":
            return state.map((q) =>
                q.id === action.payload.id
                    ? { ...q, ...action.payload.updates }
                    : q
            );
        case "delete":
            return state.filter((q) => q.id !== action.payload);
        case "add":
            return [...state, action.payload];
        default:
            return state;
    }
}

export const QuestionsList = () => {
    const { data: serverQuestions } = useListFeedback();
    const createMutation = useCreateFeedback();
    const updateMutation = useUpdateFeedback();
    const deleteMutation = useDeleteFeedback();
    const reorderMutation = useReorderFeedback();

    const [isPending, startTransition] = useTransition();
    const [optimisticQuestions, setOptimisticQuestions] = useOptimistic(
        serverQuestions || [],
        optimisticReducer
    );

    const [localQuestions, setLocalQuestions] = useState<Question[]>(
        serverQuestions || []
    );

    useEffect(() => {
        if (serverQuestions) {
            setLocalQuestions(serverQuestions);
        }
    }, [serverQuestions]);

    const handleValueChange = (newQuestions: Question[]) => {
        setLocalQuestions(newQuestions);
        startTransition(() => {
            setOptimisticQuestions({ type: "reorder", payload: newQuestions });
        });
    };

    const handleUpdateQuestion = (
        id: string,
        updates: {
            questionText?: string;
            questionType?: QuestionType;
            isRequired?: boolean;
        }
    ) => {
        setLocalQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
        );
        startTransition(() => {
            setOptimisticQuestions({
                type: "update",
                payload: { id, updates },
            });
        });
    };

    const handleDeleteQuestion = async (id: string) => {
        setLocalQuestions((prev) => prev.filter((q) => q.id !== id));
        startTransition(() => {
            setOptimisticQuestions({ type: "delete", payload: id });
        });

        if (!id.startsWith("temp-")) {
            try {
                await deleteMutation.mutateAsync({ ids: [id] });
            } catch (error) {
                console.error("Failed to delete question:", error);
            }
        }
    };

    const handleAddQuestion = () => {
        const newQuestion: Question = {
            id: `temp-${Date.now()}`,
            questionText: "New Question",
            questionType: "DESCRIPTIVE",
            isRequired: false,
            order: localQuestions.length + 1,
        };

        setLocalQuestions((prev) => [...prev, newQuestion]);
        startTransition(() => {
            setOptimisticQuestions({ type: "add", payload: newQuestion });
        });
    };

    const handleSave = async () => {
        try {
            const reorderData = localQuestions.map((q, index) => ({
                id: q.id,
                order: index + 1,
            }));
            await reorderMutation.mutateAsync({
                questions: reorderData,
            });

            const updatePromises = localQuestions
                .filter((q) => !q.id.startsWith("temp-"))
                .map((q) =>
                    updateMutation.mutateAsync({
                        id: q.id,
                        questionText: q.questionText,
                        questionType: q.questionType,
                        isRequired: q.isRequired,
                        order: q.order,
                    })
                );

            const newQuestions = localQuestions.filter((q) =>
                q.id.startsWith("temp-")
            );

            if (newQuestions.length > 0) {
                await createMutation.mutateAsync({
                    questions: newQuestions.map((q) => ({
                        questionText: q.questionText,
                        questionType: q.questionType,
                        isRequired: q.isRequired,
                        order: q.order,
                    })),
                });
            }

            await Promise.all(updatePromises);
        } catch (error) {
            console.error("Failed to save changes:", error);
        }
    };

    const hasChanges =
        JSON.stringify(serverQuestions) !== JSON.stringify(localQuestions);

    const getItemValue = (item: Question) => item.id;

    const displayQuestions = isPending ? optimisticQuestions : localQuestions;

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <ScrollArea className="flex-1">
                <div className="w-full max-w-7xl mx-auto p-6 pb-20 space-y-4">
                    <Sortable
                        value={displayQuestions}
                        onValueChange={handleValueChange}
                        getItemValue={getItemValue}
                        strategy="vertical"
                        className="space-y-2"
                    >
                        {displayQuestions.map((question) => (
                            <SortableItem key={question.id} value={question.id}>
                                <QuestionCard
                                    question={question}
                                    onUpdate={handleUpdateQuestion}
                                    onDelete={handleDeleteQuestion}
                                />
                            </SortableItem>
                        ))}
                    </Sortable>
                </div>
            </ScrollArea>

            <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-center">
                    <div className="pointer-events-auto py-4 px-6 gap-4 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-t-lg border border-b-0">
                        <Button
                            variant="outline"
                            onClick={handleAddQuestion}
                            className="gap-2"
                            disabled={isPending}
                        >
                            <Plus className="h-4 w-4" />
                            Add Question
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={
                                !hasChanges ||
                                isPending ||
                                createMutation.isPending ||
                                updateMutation.isPending ||
                                reorderMutation.isPending
                            }
                        >
                            {createMutation.isPending ||
                            updateMutation.isPending ||
                            reorderMutation.isPending
                                ? "Saving..."
                                : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const QuestionsListSkeleton = () => {
    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <ScrollArea className="flex-1">
                <div className="w-full max-w-7xl mx-auto p-6 pb-32 space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <QuestionCardSkeleton key={i} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
