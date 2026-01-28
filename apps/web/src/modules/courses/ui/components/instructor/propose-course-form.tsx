"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod/v4";

import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { RichText } from "@/components/rich-text";
import { useProposeCourse } from "@/modules/courses/hooks/use-instructor-course";
import { Plus } from "lucide-react";
import { useState } from "react";

export const proposeCourseSchema = z.object({
    code: z
        .string()
        .min(3, "Code must be at least 3 characters")
        .max(10, "Code must be at most 10 characters"),
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must be at most 200 characters"),
    lectureHours: z.number().int().min(0).max(10),
    tutorialHours: z.number().int().min(0).max(10),
    practicalHours: z.number().int().min(0).max(10),
    selfStudyHours: z.number().int().min(0).max(20),
    credits: z.number().min(0.5).max(5),
    description: z.unknown(),
});

export type ProposeCourseFormValues = z.infer<typeof proposeCourseSchema>;

export const ProposeCourseForm = () => {
    const [open, setOpen] = useState(false);
    const proposeCourse = useProposeCourse();

    const form = useForm({
        defaultValues: {
            code: "",
            title: "",
            lectureHours: 3,
            tutorialHours: 0,
            practicalHours: 0,
            selfStudyHours: 0,
            credits: 3,
            description: undefined as unknown,
        },
        validators: {
            onSubmit: proposeCourseSchema,
        },
        onSubmit: async ({ value }) => {
            await proposeCourse.mutateAsync({
                ...value,
                code: value.code.toUpperCase(),
            });
            setOpen(false);
            form.reset();
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={() => (
                    <Button>
                        <Plus className="mr-2 size-4" />
                        Propose Course
                    </Button>
                )}
            />

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Propose New Course</DialogTitle>
                    <DialogDescription>
                        Fill in the details to propose a new course for your
                        department.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <form.Field name="code">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel>Course Code</FieldLabel>
                                        <Input
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value.toUpperCase()
                                                )
                                            }
                                            placeholder="CS101"
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="credits">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel>Credits</FieldLabel>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            min="0.5"
                                            max="5"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0
                                                )
                                            }
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>
                    </div>

                    <form.Field name="title">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel>Course Title</FieldLabel>
                                    <Input
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        placeholder="Introduction to Computer Science"
                                    />
                                    {isInvalid && (
                                        <FieldError
                                            errors={field.state.meta.errors}
                                        />
                                    )}
                                </Field>
                            );
                        }}
                    </form.Field>

                    <div className="grid grid-cols-4 gap-4">
                        <form.Field name="lectureHours">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel>Lecture Hours</FieldLabel>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="10"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="tutorialHours">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel>Tutorial Hours</FieldLabel>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="10"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="practicalHours">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel>Practical Hours</FieldLabel>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="10"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="selfStudyHours">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel>
                                            Self Study Hours
                                        </FieldLabel>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="20"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>
                    </div>

                    <form.Field name="description">
                        {(field) => (
                            <Field>
                                <FieldLabel>Description</FieldLabel>
                                <div className="border rounded-md">
                                    <RichText
                                        content={field.state.value}
                                        onChange={(content) =>
                                            field.handleChange(content)
                                        }
                                        disabled={false}
                                    />
                                </div>
                            </Field>
                        )}
                    </form.Field>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <form.Subscribe selector={(s) => s.canSubmit}>
                            {(canSubmit) => (
                                <Button
                                    type="submit"
                                    disabled={
                                        !canSubmit || proposeCourse.isPending
                                    }
                                >
                                    {proposeCourse.isPending
                                        ? "Proposing..."
                                        : "Propose Course"}
                                </Button>
                            )}
                        </form.Subscribe>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
