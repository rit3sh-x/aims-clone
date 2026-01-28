"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useAuthLayoutContext } from "../../context/auth-context";

const formSchema = z
    .object({
        password: z.string().min(8, "Minimum 8 characters"),
        confirmPassword: z.string().min(8, "Minimum 8 characters"),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type ResetPasswordFormValues = z.infer<typeof formSchema>;

interface ResetPasswordFormProps {
    onSubmit: (values: ResetPasswordFormValues) => Promise<void>;
}

export const ResetPasswordForm = ({ onSubmit }: ResetPasswordFormProps) => {
    const { setIsTyping, setPasswordExist, setShowPassword } =
        useAuthLayoutContext();

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleVisibilityChange = (
        newPasswordVisible: boolean,
        confirmPasswordVisible: boolean
    ) => {
        setShowPassword(newPasswordVisible || confirmPasswordVisible);
    };

    const form = useForm({
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            await onSubmit(value);
        },
    });

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                    Set new password
                </h1>
                <p className="text-muted-foreground text-sm">
                    Enter your new password below
                </p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="space-y-6 flex flex-col items-center justify-center"
            >
                <form.Field name="password">
                    {(field) => {
                        const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel className="text-white">
                                    New password
                                </FieldLabel>

                                <div className="relative">
                                    <Input
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        className="text-white"
                                        name="new-password"
                                        autoComplete="off"
                                        data-form-type="newPassword"
                                        data-lpignore="true"
                                        inputMode="text"
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            setPasswordExist(
                                                e.target.value.length > 0
                                            );
                                            setIsTyping(true);
                                            setTimeout(
                                                () => setIsTyping(false),
                                                600
                                            );
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const next = !showNewPassword;
                                            setShowNewPassword(next);
                                            handleVisibilityChange(
                                                next,
                                                showConfirmPassword
                                            );
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                                    >
                                        {showNewPassword ? (
                                            <EyeOffIcon className="size-4" />
                                        ) : (
                                            <EyeIcon className="size-4" />
                                        )}
                                    </button>
                                </div>

                                {isInvalid && (
                                    <FieldError
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            </Field>
                        );
                    }}
                </form.Field>

                <form.Field name="confirmPassword">
                    {(field) => {
                        const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel className="text-white">
                                    Confirm password
                                </FieldLabel>

                                <div className="relative">
                                    <Input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        name="confirm-new-password"
                                        autoComplete="off"
                                        data-form-type="confirmPassword"
                                        data-lpignore="true"
                                        inputMode="text"
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            setIsTyping(true);
                                            setTimeout(
                                                () => setIsTyping(false),
                                                600
                                            );
                                        }}
                                        className="text-white"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const next = !showConfirmPassword;
                                            setShowConfirmPassword(next);
                                            handleVisibilityChange(
                                                showNewPassword,
                                                next
                                            );
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOffIcon className="size-4" />
                                        ) : (
                                            <EyeIcon className="size-4" />
                                        )}
                                    </button>
                                </div>

                                {isInvalid && (
                                    <FieldError
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            </Field>
                        );
                    }}
                </form.Field>

                <form.Subscribe selector={(s) => s.canSubmit}>
                    {(canSubmit) => (
                        <Button
                            type="submit"
                            disabled={!canSubmit}
                            className="w-full bg-white text-black hover:bg-white/90 hover:text-black hover:border border-border"
                        >
                            Reset password
                        </Button>
                    )}
                </form.Subscribe>
            </form>
        </div>
    );
};
