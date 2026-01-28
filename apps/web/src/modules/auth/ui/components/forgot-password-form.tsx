"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import Link from "next/link";

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@workspace/ui/components/field";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useAuthLayoutContext } from "../../context/auth-context";

const formSchema = z.object({
    email: z.email("Invalid email"),
});

export type ForgotPasswordFormValues = z.infer<typeof formSchema>;

interface ForgotPasswordFormProps {
    onSubmit: (values: ForgotPasswordFormValues) => Promise<void>;
}

export const ForgotPasswordForm = ({ onSubmit }: ForgotPasswordFormProps) => {
    const { setIsTyping } = useAuthLayoutContext();

    const form = useForm({
        defaultValues: {
            email: "",
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
                    Forgot password?
                </h1>
                <p className="text-white/40 text-sm">
                    Enter your email to receive a reset link
                </p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="space-y-6 flex flex-col items-center justify-center"
            >
                <FieldGroup>
                    <form.Field name="email">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel className="text-white">
                                        Email
                                    </FieldLabel>

                                    <Input
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            setIsTyping(true);
                                            setTimeout(
                                                () => setIsTyping(false),
                                                600
                                            );
                                        }}
                                        placeholder="you@iitrpr.ac.in"
                                        className="text-white px-2"
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
                </FieldGroup>

                <form.Subscribe selector={(s) => s.canSubmit}>
                    {(canSubmit) => (
                        <Button
                            type="submit"
                            disabled={!canSubmit}
                            className="w-full bg-white text-black hover:bg-white/90 hover:text-black hover:border border-border"
                        >
                            Send reset OTP
                        </Button>
                    )}
                </form.Subscribe>

                <Link
                    href="/login"
                    className="relative text-sm text-white/40 transition-colors hover:text-white after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                    Back to login
                </Link>
            </form>
        </div>
    );
};
