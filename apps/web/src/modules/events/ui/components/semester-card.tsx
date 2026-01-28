import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { GradeType } from "@workspace/db";
import { SemesterCardType } from "../../types";

interface SemesterCardProps {
    data: SemesterCardType;
}

export const SemesterCard = ({ data }: SemesterCardProps) => {
    const { semester, courses, sgpa, cgpa } = data;
    const [isExpanded, setIsExpanded] = useState(false);

    const statusColors = {
        UPCOMING: "bg-blue-100 text-blue-800",
        ONGOING: "bg-green-100 text-green-800",
        COMPLETED: "bg-gray-100 text-gray-800",
    };

    const gradeColors: Record<GradeType, string> = {
        A: "bg-green-100 text-green-800",
        "A-": "bg-green-50 text-green-700",
        B: "bg-blue-100 text-blue-800",
        "B-": "bg-blue-50 text-blue-700",
        C: "bg-yellow-100 text-yellow-800",
        "C-": "bg-yellow-50 text-yellow-700",
        D: "bg-orange-100 text-orange-800",
        E: "bg-red-100 text-red-800",
        F: "bg-red-100 text-red-800",
    };

    const semesterLabel = `${semester.semester} ${semester.year}`;
    const totalCredits = courses.reduce((sum, c) => sum + c.course.credits, 0);

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{semesterLabel}</CardTitle>
                        <CardDescription>
                            {new Date(semester.startDate).toLocaleDateString()}{" "}
                            - {new Date(semester.endDate).toLocaleDateString()}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground mt-1">
                            {courses.length} courses • {totalCredits} credits
                        </p>
                    </div>
                    <Badge className={statusColors[semester.status]}>
                        {semester.status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">
                            SGPA
                        </p>
                        <p className="text-3xl font-bold text-blue-600">
                            {sgpa.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">
                            CGPA
                        </p>
                        <p className="text-3xl font-bold text-purple-600">
                            {cgpa.toFixed(2)}
                        </p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-center gap-2 text-sm"
                >
                    {isExpanded ? (
                        <>
                            Hide Courses
                            <ChevronUp className="w-4 h-4" />
                        </>
                    ) : (
                        <>
                            View Courses
                            <ChevronDown className="w-4 h-4" />
                        </>
                    )}
                </Button>
            </CardContent>

            {isExpanded && (
                <div className="border-t border-border bg-muted p-4">
                    <div className="space-y-3">
                        {courses.map((item) => (
                            <div
                                key={item.course.id}
                                className="bg-background rounded-lg p-4 flex items-center justify-between"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-foreground">
                                        {item.course.code}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {item.course.title}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-muted-foreground">
                                        {item.course.credits} credits
                                    </p>
                                    <Badge className={gradeColors[item.grade]}>
                                        {item.grade}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};
