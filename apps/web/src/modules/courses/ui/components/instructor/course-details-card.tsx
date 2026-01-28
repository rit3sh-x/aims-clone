"use client";

import { useState } from "react";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { humanizeEnum } from "@/lib/formatters";
import {
    useSuspenseCourse,
    useProposeOffering,
} from "@/modules/courses/hooks/use-instructor-course";
import { RichText } from "@/components/rich-text";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { MoreVertical, Send, Plus, Trash2 } from "lucide-react";

const ASSESSMENT_TYPES = [
    "QUIZ",
    "ASSIGNMENT",
    "MIDTERM",
    "PROJECT",
    "LAB",
    "ENDTERM",
] as const;

type AssessmentType = (typeof ASSESSMENT_TYPES)[number];

interface AssessmentTemplate {
    type: AssessmentType;
    maxMarks: number;
    weightage: number;
}

interface CourseDetailsCardProps {
    courseId: string;
}

export const CourseDetailsCard = ({ courseId }: CourseDetailsCardProps) => {
    const { data } = useSuspenseCourse(courseId);
    const { course, department } = data;
    const [openOfferingDialog, setOpenOfferingDialog] = useState(false);

    const statusColors: Record<string, string> = {
        PROPOSED: "bg-yellow-100 text-yellow-800",
        HOD_ACCEPTED: "bg-blue-100 text-blue-800",
        ADMIN_ACCEPTED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
    };

    const canProposeOffering = course.status === "ADMIN_ACCEPTED";

    return (
        <>
            <Card className="p-6 space-y-6 w-full h-full overflow-y-auto">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold">
                            {course.code} — {course.title}
                        </h2>

                        <div className="flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "uppercase text-[10px]",
                                    statusColors[course.status]
                                )}
                            >
                                {humanizeEnum(course.status)}
                            </Badge>

                            <Badge variant="secondary" className="text-[10px]">
                                {department.code}
                            </Badge>
                        </div>
                    </div>

                    {canProposeOffering && (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={(props) => (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        {...props}
                                    >
                                        <MoreVertical className="size-4" />
                                    </Button>
                                )}
                            />

                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                    onClick={() => setOpenOfferingDialog(true)}
                                >
                                    <Send className="mr-2 size-4" />
                                    Propose Offering
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <Info label="Credits" value={course.credits} />
                    <Info label="Lecture Hours" value={course.lectureHours} />
                    <Info label="Tutorial Hours" value={course.tutorialHours} />
                    <Info
                        label="Practical Hours"
                        value={course.practicalHours}
                    />
                    <Info
                        label="Self Study Hours"
                        value={course.selfStudyHours}
                    />
                    <Info label="Department" value={department.name} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Course Description</h3>
                    <RichText content={course.description} disabled={true} />
                </div>
            </Card>

            <ProposeOfferingDialog
                courseId={courseId}
                courseCode={course.code}
                open={openOfferingDialog}
                onOpenChange={setOpenOfferingDialog}
            />
        </>
    );
};

interface ProposeOfferingDialogProps {
    courseId: string;
    courseCode: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_ASSESSMENTS: AssessmentTemplate[] = [
    { type: "MIDTERM", maxMarks: 100, weightage: 30 },
    { type: "ENDTERM", maxMarks: 100, weightage: 50 },
    { type: "ASSIGNMENT", maxMarks: 100, weightage: 20 },
];

const ProposeOfferingDialog = ({
    courseId,
    courseCode,
    open,
    onOpenChange,
}: ProposeOfferingDialogProps) => {
    const proposeOffering = useProposeOffering();
    const [assessments, setAssessments] =
        useState<AssessmentTemplate[]>(DEFAULT_ASSESSMENTS);

    const totalWeightage = assessments.reduce((sum, a) => sum + a.weightage, 0);
    const isValid = totalWeightage === 100 && assessments.length > 0;

    const updateAssessment = (
        index: number,
        field: keyof AssessmentTemplate,
        value: string | number
    ) => {
        setAssessments((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const addAssessment = () => {
        setAssessments((prev) => [
            ...prev,
            { type: "QUIZ", maxMarks: 100, weightage: 0 },
        ]);
    };

    const removeAssessment = (index: number) => {
        if (assessments.length > 1) {
            setAssessments((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        await proposeOffering.mutateAsync({
            courseId,
            assessmentTemplates: assessments,
        });

        setAssessments(DEFAULT_ASSESSMENTS);
        onOpenChange(false);
    };

    const handleClose = (isOpen: boolean) => {
        if (!isOpen) {
            setAssessments(DEFAULT_ASSESSMENTS);
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Propose Offering for {courseCode}</DialogTitle>
                    <DialogDescription>
                        Configure the assessment structure for this course
                        offering. Total weightage must equal 100%.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">
                                Assessment Templates
                            </h3>
                            <Badge
                                variant={isValid ? "default" : "destructive"}
                            >
                                Total: {totalWeightage}%
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            {assessments.map((assessment, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-12 gap-2 items-end p-3 border rounded-md bg-muted/30"
                                >
                                    <div className="col-span-4 space-y-1">
                                        <Label className="text-xs">Type</Label>
                                        <Select
                                            value={assessment.type}
                                            onValueChange={(value) =>
                                                updateAssessment(
                                                    index,
                                                    "type",
                                                    value as AssessmentType
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ASSESSMENT_TYPES.map(
                                                    (type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                        >
                                                            {humanizeEnum(type)}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-3 space-y-1">
                                        <Label className="text-xs">
                                            Max Marks
                                        </Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            className="h-9"
                                            value={assessment.maxMarks}
                                            onChange={(e) =>
                                                updateAssessment(
                                                    index,
                                                    "maxMarks",
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="col-span-3 space-y-1">
                                        <Label className="text-xs">
                                            Weightage %
                                        </Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="h-9"
                                            value={assessment.weightage}
                                            onChange={(e) =>
                                                updateAssessment(
                                                    index,
                                                    "weightage",
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="col-span-2 flex justify-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9"
                                            onClick={() =>
                                                removeAssessment(index)
                                            }
                                            disabled={assessments.length <= 1}
                                        >
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={addAssessment}
                            >
                                <Plus className="mr-2 size-4" />
                                Add Assessment
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleClose(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={!isValid || proposeOffering.isPending}
                        >
                            {proposeOffering.isPending
                                ? "Proposing..."
                                : "Propose Offering"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const Info = ({ label, value }: { label: string; value: string | number }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
    </div>
);

export const CourseDetailsCardSkeleton = () => {
    return (
        <Card className="p-6 space-y-6 h-full">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-64" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-20 rounded-full" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                    ))}
                </div>
            </div>
        </Card>
    );
};
