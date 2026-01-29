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
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { cn } from "@workspace/ui/lib/utils";
import { humanizeEnum } from "@/lib/formatters";
import {
    useSuspenseCourse,
    useProposeOffering,
    useSearchBatches,
    useSearchInstructors,
    useSearchCourses,
} from "@/modules/courses/hooks/use-instructor-course";
import { RichText } from "@/components/rich-text";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { MoreVertical, Send, Plus, Trash2 } from "lucide-react";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod/v4";
import MultipleSelector, { Option } from "@/components/multi-select";

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

const proposeOfferingSchema = z.object({
    batchIds: z.array(z.string()).min(1, "At least one batch is required"),
    instructorIds: z.array(z.string()),
    prerequisiteCourseIds: z.array(z.string()),
    assessmentTemplates: z
        .array(
            z.object({
                type: z.enum(ASSESSMENT_TYPES),
                maxMarks: z.number().positive("Max marks must be positive"),
                weightage: z
                    .number()
                    .min(1)
                    .max(100, "Weightage must be between 1 and 100"),
            })
        )
        .min(1, "At least one assessment is required"),
});

const ProposeOfferingDialog = ({
    courseId,
    courseCode,
    open,
    onOpenChange,
}: ProposeOfferingDialogProps) => {
    const proposeOffering = useProposeOffering();

    const [batchSearch, setBatchSearch] = useState("");
    const [instructorSearch, setInstructorSearch] = useState("");
    const [courseSearch, setCourseSearch] = useState("");

    // Store selected options with labels
    const [selectedBatches, setSelectedBatches] = useState<Option[]>([]);
    const [selectedInstructors, setSelectedInstructors] = useState<Option[]>(
        []
    );
    const [selectedCourses, setSelectedCourses] = useState<Option[]>([]);

    const { data: batchResults } = useSearchBatches(batchSearch);
    const { data: instructorResults } = useSearchInstructors(instructorSearch);
    const { data: courseResults } = useSearchCourses(courseSearch);

    const form = useForm({
        defaultValues: {
            batchIds: [] as string[],
            instructorIds: [] as string[],
            prerequisiteCourseIds: [] as string[],
            assessmentTemplates: DEFAULT_ASSESSMENTS,
        },
        validators: {
            onSubmit: proposeOfferingSchema,
        },
        onSubmit: ({ value }) => {
            proposeOffering.mutate(
                {
                    courseId,
                    ...value,
                },
                {
                    onSuccess: () => {
                        onOpenChange(false);
                        form.reset();
                        setSelectedBatches([]);
                        setSelectedInstructors([]);
                        setSelectedCourses([]);
                    },
                }
            );
        },
    });

    const handleClose = (isOpen: boolean) => {
        if (!isOpen) {
            form.reset();
            setBatchSearch("");
            setInstructorSearch("");
            setCourseSearch("");
            setSelectedBatches([]);
            setSelectedInstructors([]);
            setSelectedCourses([]);
        }
        onOpenChange(isOpen);
    };

    const totalWeightage = useStore(form.baseStore, (state) =>
        state.values.assessmentTemplates.reduce(
            (sum, a) => sum + a.weightage,
            0
        )
    );

    const handleSearchBatches = async (search: string): Promise<Option[]> => {
        if (!search || search.length < 1) return [];
        setBatchSearch(search);

        if (!batchResults) return [];

        return batchResults.map((batch) => ({
            value: batch.id,
            label: `${batch.programCode} - ${batch.year} (${humanizeEnum(batch.degreeType)})`,
        }));
    };

    const handleSearchInstructors = async (
        search: string
    ): Promise<Option[]> => {
        if (!search || search.length < 1) return [];
        setInstructorSearch(search);

        if (!instructorResults) return [];

        return instructorResults.map((instructor) => ({
            value: instructor.id,
            label: `${instructor.name} (${instructor.employeeId})`,
        }));
    };

    const handleSearchCourses = async (search: string): Promise<Option[]> => {
        if (!search || search.length < 1) return [];
        setCourseSearch(search);

        if (!courseResults) return [];

        return courseResults.map((course) => ({
            value: course.id,
            label: `${course.code} - ${course.title}`,
        }));
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-7xl w-full mx-auto m-4 lg:m-0 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Propose Offering for {courseCode}</DialogTitle>
                    <DialogDescription>
                        Configure the course offering details including batches,
                        instructors, prerequisites, and assessment structure.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <form.Field name="batchIds">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;

                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel>
                                                Target Batches *
                                            </FieldLabel>
                                            <MultipleSelector
                                                value={selectedBatches}
                                                onChange={(options) => {
                                                    setSelectedBatches(options);
                                                    field.handleChange(
                                                        options.map(
                                                            (o) => o.value
                                                        )
                                                    );
                                                }}
                                                onSearch={handleSearchBatches}
                                                placeholder="Search batches..."
                                                emptyIndicator="No batches found"
                                                loadingIndicator={
                                                    <div className="p-2 text-sm">
                                                        Searching...
                                                    </div>
                                                }
                                                disabled={
                                                    proposeOffering.isPending
                                                }
                                                triggerSearchOnFocus
                                            />
                                            {isInvalid && (
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>

                            <form.Field name="instructorIds">
                                {(field) => (
                                    <Field>
                                        <FieldLabel>
                                            Additional Instructors (Optional)
                                        </FieldLabel>
                                        <MultipleSelector
                                            value={selectedInstructors}
                                            onChange={(options: Option[]) => {
                                                setSelectedInstructors(options);
                                                field.handleChange(
                                                    options.map(
                                                        (o: Option) => o.value
                                                    )
                                                );
                                            }}
                                            onSearch={handleSearchInstructors}
                                            placeholder="Search instructors..."
                                            emptyIndicator="No instructors found"
                                            loadingIndicator={
                                                <div className="p-2 text-sm">
                                                    Searching...
                                                </div>
                                            }
                                            disabled={proposeOffering.isPending}
                                            triggerSearchOnFocus
                                        />
                                    </Field>
                                )}
                            </form.Field>

                            <form.Field name="prerequisiteCourseIds">
                                {(field) => (
                                    <Field>
                                        <FieldLabel>
                                            Prerequisite Courses (Optional)
                                        </FieldLabel>
                                        <MultipleSelector
                                            value={selectedCourses}
                                            onChange={(options: Option[]) => {
                                                setSelectedCourses(options);
                                                field.handleChange(
                                                    options.map(
                                                        (o: Option) => o.value
                                                    )
                                                );
                                            }}
                                            onSearch={handleSearchCourses}
                                            placeholder="Search courses..."
                                            emptyIndicator="No courses found"
                                            loadingIndicator={
                                                <div className="p-2 text-sm">
                                                    Searching...
                                                </div>
                                            }
                                            disabled={proposeOffering.isPending}
                                            triggerSearchOnFocus
                                        />
                                    </Field>
                                )}
                            </form.Field>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">
                                    Assessment Templates *
                                </h3>
                                <Badge
                                    variant={
                                        totalWeightage === 100
                                            ? "default"
                                            : "destructive"
                                    }
                                >
                                    Total: {totalWeightage}%
                                </Badge>
                            </div>

                            <form.Field name="assessmentTemplates" mode="array">
                                {(field) => (
                                    <div className="space-y-3">
                                        {field.state.value.map((_, index) => (
                                            <form.Field
                                                key={index}
                                                name={`assessmentTemplates[${index}]`}
                                            >
                                                {(subField) => (
                                                    <div className="grid grid-cols-12 gap-2 items-end p-3 border rounded-md bg-muted/30">
                                                        <div className="col-span-4 space-y-1">
                                                            <Label className="text-xs">
                                                                Type
                                                            </Label>
                                                            <form.Field
                                                                name={`assessmentTemplates[${index}].type`}
                                                            >
                                                                {(
                                                                    typeField
                                                                ) => (
                                                                    <Select
                                                                        value={
                                                                            typeField
                                                                                .state
                                                                                .value
                                                                        }
                                                                        onValueChange={(
                                                                            value
                                                                        ) =>
                                                                            typeField.handleChange(
                                                                                value as AssessmentType
                                                                            )
                                                                        }
                                                                    >
                                                                        <SelectTrigger className="h-9">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {ASSESSMENT_TYPES.map(
                                                                                (
                                                                                    type
                                                                                ) => (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            type
                                                                                        }
                                                                                        value={
                                                                                            type
                                                                                        }
                                                                                    >
                                                                                        {humanizeEnum(
                                                                                            type
                                                                                        )}
                                                                                    </SelectItem>
                                                                                )
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            </form.Field>
                                                        </div>

                                                        <div className="col-span-3 space-y-1">
                                                            <Label className="text-xs">
                                                                Max Marks
                                                            </Label>
                                                            <form.Field
                                                                name={`assessmentTemplates[${index}].maxMarks`}
                                                            >
                                                                {(
                                                                    marksField
                                                                ) => (
                                                                    <Input
                                                                        type="number"
                                                                        min="1"
                                                                        className="h-9"
                                                                        value={
                                                                            marksField
                                                                                .state
                                                                                .value
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            marksField.handleChange(
                                                                                parseInt(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                ) ||
                                                                                    0
                                                                            )
                                                                        }
                                                                    />
                                                                )}
                                                            </form.Field>
                                                        </div>

                                                        <div className="col-span-3 space-y-1">
                                                            <Label className="text-xs">
                                                                Weightage %
                                                            </Label>
                                                            <form.Field
                                                                name={`assessmentTemplates[${index}].weightage`}
                                                            >
                                                                {(
                                                                    weightageField
                                                                ) => (
                                                                    <Input
                                                                        type="number"
                                                                        min="0"
                                                                        max="100"
                                                                        className="h-9"
                                                                        value={
                                                                            weightageField
                                                                                .state
                                                                                .value
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            weightageField.handleChange(
                                                                                parseInt(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                ) ||
                                                                                    0
                                                                            )
                                                                        }
                                                                    />
                                                                )}
                                                            </form.Field>
                                                        </div>

                                                        <div className="col-span-2 flex justify-end">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9"
                                                                onClick={() => {
                                                                    const current =
                                                                        field
                                                                            .state
                                                                            .value;
                                                                    if (
                                                                        current.length >
                                                                        1
                                                                    ) {
                                                                        field.handleChange(
                                                                            current.filter(
                                                                                (
                                                                                    _,
                                                                                    i
                                                                                ) =>
                                                                                    i !==
                                                                                    index
                                                                            )
                                                                        );
                                                                    }
                                                                }}
                                                                disabled={
                                                                    field.state
                                                                        .value
                                                                        .length <=
                                                                    1
                                                                }
                                                            >
                                                                <Trash2 className="size-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </form.Field>
                                        ))}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => {
                                                field.handleChange([
                                                    ...field.state.value,
                                                    {
                                                        type: "QUIZ",
                                                        maxMarks: 100,
                                                        weightage: 0,
                                                    } as AssessmentTemplate,
                                                ]);
                                            }}
                                        >
                                            <Plus className="mr-2 size-4" />
                                            Add Assessment
                                        </Button>
                                    </div>
                                )}
                            </form.Field>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleClose(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>

                        <form.Subscribe selector={(s) => s.canSubmit}>
                            {(canSubmit) => (
                                <Button
                                    type="submit"
                                    disabled={
                                        !canSubmit ||
                                        proposeOffering.isPending ||
                                        totalWeightage !== 100
                                    }
                                    className="flex-1"
                                >
                                    {proposeOffering.isPending
                                        ? "Proposing..."
                                        : "Propose Offering"}
                                </Button>
                            )}
                        </form.Subscribe>
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
