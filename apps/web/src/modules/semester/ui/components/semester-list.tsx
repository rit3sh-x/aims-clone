"use client";

import { useState } from "react";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { Button } from "@workspace/ui/components/button";

import { SemesterCard } from "./semester-card";
import { SemesterFormModal, SemesterFormValues } from "./semester-form-modal";
import {
    useInfiniteSemesters,
    useStartSemester,
    useEndSemester,
    useUpdateSemester,
} from "../../hooks/use-semester";
import { cn } from "@workspace/ui/lib/utils";

export const SemesterList = () => {
    const { semesters, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteSemesters();

    const startSemester = useStartSemester();
    const endSemester = useEndSemester();
    const updateSemester = useUpdateSemester();

    const [isModalOpen, setModalOpen] = useState(false);
    const [editingSemester, setEditingSemester] = useState<SemesterFormValues | null>(null);

    const isBlocked =
        startSemester.isPending ||
        endSemester.isPending ||
        updateSemester.isPending;

    const handleCreate = () => {
        setEditingSemester(null);
        setModalOpen(true);
    };

    const handleEdit = (semester: SemesterFormValues) => {
        setEditingSemester(semester);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingSemester(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={handleCreate}>Create Semester</Button>
            </div>

            {semesters.map((semester) => (
                <SemesterCard
                    key={semester.id}
                    semester={semester}
                    disabled={isBlocked}
                    onEdit={(id) =>
                        handleEdit({
                            id: semester.id,
                            year: semester.year,
                            semester: semester.semester,
                            startDate: semester.startDate,
                            endDate: semester.endDate,
                            enrollmentDeadline: semester.enrollmentDeadline,
                            feedbackFormStartDate: semester.feedbackFormStartDate,
                        })
                    }
                    onStart={(id) => startSemester.mutate({ id })}
                    onEnd={(id) => endSemester.mutate({ id })}
                />
            ))}

            <InfiniteScrollTrigger
                canLoadMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                noMoreText="No more semesters to load"
            />

            <SemesterFormModal
                open={isModalOpen}
                onClose={handleCloseModal}
                initialValues={editingSemester || undefined}
            />
        </div>
    );
};

export const SemesterListSkeleton = () => {
    return (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        "p-4 border rounded-md shadow-sm bg-muted animate-pulse"
                    )}
                >
                    <div className="h-4 bg-muted-foreground/30 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-muted-foreground/30 rounded w-2/3 mb-1" />
                    <div className="h-3 bg-muted-foreground/30 rounded w-1/2" />
                </div>
            ))}
        </div>
    );
};
