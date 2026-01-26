"use client";

import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { cn } from "@workspace/ui/lib/utils";

import { SEMESTER_TYPE, type SemesterType } from "../../constants";
import {
    useCreateSemester,
    useUpdateSemester,
} from "../../hooks/use-semester";

export const semesterFormSchema = z.object({
    id: z.string().optional(),
    year: z.number().min(2020).max(2100),
    semester: z.enum(SEMESTER_TYPE),
    startDate: z.date(),
    endDate: z.date(),
    enrollmentDeadline: z.date(),
    feedbackFormStartDate: z.date(),
});

export type SemesterFormValues = z.infer<typeof semesterFormSchema>;

interface SemesterFormModalProps {
    open: boolean;
    onClose: () => void;
    initialValues?: SemesterFormValues;
}

export const SemesterFormModal = ({
    open,
    onClose,
    initialValues,
}: SemesterFormModalProps) => {
    const isEdit = Boolean(initialValues?.id);
    const createSemester = useCreateSemester();
    const updateSemester = useUpdateSemester();

    const form = useForm({
        defaultValues:
            initialValues ??
            ({
                year: new Date().getFullYear(),
                semester: SEMESTER_TYPE[0],
                startDate: new Date(),
                endDate: new Date(),
                enrollmentDeadline: new Date(),
                feedbackFormStartDate: new Date(),
            } as SemesterFormValues),
        validators: {
            onSubmit: semesterFormSchema,
        },
        onSubmit: async ({ value }) => {
            if (isEdit) {
                updateSemester.mutate(
                    {
                        id: value.id!,
                        year: value.year,
                        semester: value.semester,
                        startDate: value.startDate,
                        endDate: value.endDate,
                        enrollmentDeadline: value.enrollmentDeadline,
                        feedbackFormStartDate: value.feedbackFormStartDate,
                    },
                    { onSuccess: onClose }
                );
            } else {
                createSemester.mutate(
                    {
                        year: value.year,
                        semester: value.semester,
                        startDate: value.startDate,
                        endDate: value.endDate,
                        enrollmentDeadline: value.enrollmentDeadline,
                        feedbackFormStartDate: value.feedbackFormStartDate,
                    },
                    { onSuccess: onClose }
                );
            }
        },
    });

    useEffect(() => {
        if (initialValues) {
            form.reset();
            form.setFieldValue("year", initialValues.year);
            form.setFieldValue("semester", initialValues.semester);
            form.setFieldValue("startDate", initialValues.startDate);
            form.setFieldValue("endDate", initialValues.endDate);
            form.setFieldValue("enrollmentDeadline", initialValues.enrollmentDeadline);
            form.setFieldValue("feedbackFormStartDate", initialValues.feedbackFormStartDate);
            if (initialValues.id) {
                form.setFieldValue("id", initialValues.id);
            }
        }
    }, [initialValues, form]);

    const isPending = createSemester.isPending || updateSemester.isPending;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit Semester" : "Create Semester"}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="space-y-6"
                >
                    <form.Field name="year">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel>Year</FieldLabel>
                                    <Input
                                        type="number"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(Number(e.target.value))}
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            );
                        }}
                    </form.Field>

                    <form.Field name="semester">
                        {(field) => (
                            <Field>
                                <FieldLabel>Semester</FieldLabel>
                                <Select value={field.state.value} onValueChange={(v) => field.handleChange(v as SemesterType)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semester type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SEMESTER_TYPE.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="startDate">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel>Start date</FieldLabel>
                                    <Popover>
                                        <PopoverTrigger render={(props) => (
                                            <Button
                                                {...props}
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.state.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 size-4" />
                                                {field.state.value ? format(field.state.value, "dd MMM yyyy") : "Pick a date"}
                                            </Button>
                                        )} />
                                        <PopoverContent align="start" className="p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.state.value}
                                                onSelect={(date) => date && field.handleChange(date)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            );
                        }}
                    </form.Field>

                    <form.Field name="endDate">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel>End date</FieldLabel>
                                    <Popover>
                                        <PopoverTrigger render={(props) => (
                                            <Button
                                                {...props}
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.state.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 size-4" />
                                                {field.state.value ? format(field.state.value, "dd MMM yyyy") : "Pick a date"}
                                            </Button>
                                        )} />
                                        <PopoverContent align="start" className="p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.state.value}
                                                onSelect={(date) => date && field.handleChange(date)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            );
                        }}
                    </form.Field>

                    <form.Field name="enrollmentDeadline">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel>Enrollment deadline</FieldLabel>
                                    <Popover>
                                        <PopoverTrigger render={(props) => (
                                            <Button
                                                {...props}
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.state.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 size-4" />
                                                {field.state.value ? format(field.state.value, "dd MMM yyyy") : "Pick a date"}
                                            </Button>
                                        )} />
                                        <PopoverContent align="start" className="p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.state.value}
                                                onSelect={(date) => date && field.handleChange(date)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            );
                        }}
                    </form.Field>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" className={"flex-1"} onClick={onClose}>
                            Cancel
                        </Button>
                        <form.Subscribe selector={(s) => s.canSubmit}>
                            {(canSubmit) => (
                                <Button type="submit" className="flex-1" disabled={!canSubmit || isPending}>
                                    {isEdit ? "Update" : "Create"}
                                </Button>
                            )}
                        </form.Subscribe>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};