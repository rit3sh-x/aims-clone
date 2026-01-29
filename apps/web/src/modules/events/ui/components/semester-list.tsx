"use client";

import { useStudentRecord } from "../../hooks/use-student-record";
import { SemesterCard } from "./semester-card";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { GraduationCap } from "lucide-react";

export const SemesterListSkeleton = () => {
    return (
        <div className="space-y-4 pb-6">
            {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <Skeleton className="h-20 w-full rounded-lg" />
                        <Skeleton className="h-20 w-full rounded-lg" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </Card>
            ))}
        </div>
    );
};

export const SemesterList = () => {
    const { data: studentRecord } = useStudentRecord();

    if (studentRecord.length === 0) {
        return (
            <Card className="p-12">
                <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="rounded-full bg-muted p-4">
                        <GraduationCap className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                            No Academic Records
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Your academic records will appear here once you
                            complete courses.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const latestRecord = studentRecord[studentRecord.length - 1];
    const totalCredits = studentRecord.reduce(
        (sum, sem) =>
            sum + sem.courses.reduce((s, c) => s + c.course.credits, 0),
        0
    );
    const totalCourses = studentRecord.reduce(
        (sum, sem) => sum + sem.courses.length,
        0
    );

    return (
        <div className="space-y-6 pb-6">
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-background/60 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                Current CGPA
                            </p>
                            <p className="text-3xl font-bold text-primary">
                                {latestRecord?.cgpa.toFixed(2) || "—"}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-background/60 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                Total Credits
                            </p>
                            <p className="text-3xl font-bold">{totalCredits}</p>
                        </div>
                        <div className="text-center p-4 bg-background/60 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                Courses Completed
                            </p>
                            <p className="text-3xl font-bold">{totalCourses}</p>
                        </div>
                        <div className="text-center p-4 bg-background/60 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                Semesters
                            </p>
                            <p className="text-3xl font-bold">
                                {studentRecord.length}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {studentRecord.map((semester) => (
                    <SemesterCard key={semester.semester.id} data={semester} />
                ))}
            </div>
        </div>
    );
};
