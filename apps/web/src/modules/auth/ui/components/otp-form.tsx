"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { RefreshCcwIcon } from "lucide-react";

import { Field, FieldError } from "@workspace/ui/components/field";
import { Button } from "@workspace/ui/components/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@workspace/ui/components/input-otp";

const OTP_LENGTH = 6;

export const otpSchema = z.object({
    otp: z
        .string()
        .length(OTP_LENGTH, "OTP must be 6 digits")
        .regex(new RegExp(REGEXP_ONLY_DIGITS), "Only numbers allowed"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

interface OtpFormProps {
    onSubmit: (values: OtpFormValues) => Promise<void>;
    onResend: () => Promise<void>;
}

export const OtpForm = ({ onSubmit, onResend }: OtpFormProps) => {
    const form = useForm({
        defaultValues: {
            otp: "",
        },
        validators: {
            onSubmit: otpSchema,
        },
        onSubmit: async ({ value }) => {
            const cleanOtp = value.otp.replace(/\D/g, "").slice(0, OTP_LENGTH);

            await onSubmit({ otp: cleanOtp });
        },
    });

    const handleResend = async () => {
        try {
            await onResend();
            toast.success("OTP resent");
        } catch {
            toast.error("Failed to resend OTP");
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                    Verify OTP
                </h1>
                <p className="text-muted-foreground text-sm">
                    Enter the 6 digit code sent to your email
                </p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="space-y-6 flex flex-col items-center w-full"
            >
                <div className="flex flex-col w-full gap-4 justify-center items-end">
                    <form.Field name="otp">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <InputOTP
                                        maxLength={OTP_LENGTH}
                                        value={field.state.value}
                                        onChange={(value) => {
                                            const clean = value
                                                .replace(/\D/g, "")
                                                .slice(0, OTP_LENGTH);
                                            field.handleChange(clean);
                                        }}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        className="w-full"
                                    >
                                        <InputOTPGroup className="text-white w-full justify-between gap-2">
                                            {Array.from({
                                                length: OTP_LENGTH,
                                            }).map((_, i) => (
                                                <InputOTPSlot
                                                    key={i}
                                                    index={i}
                                                    className="caret-white h-16 flex-1 text-xl rounded-sm border border-white"
                                                />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>

                                    {isInvalid && (
                                        <FieldError
                                            errors={field.state.meta.errors}
                                        />
                                    )}
                                </Field>
                            );
                        }}
                    </form.Field>

                    <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={handleResend}
                        className="rounded-full text-white border border-white hover:bg-white transition-all hover:text-black flex items-center gap-1 px-2"
                    >
                        <RefreshCcwIcon className="size-3" />
                        <span className="text-[11px]">Resend OTP</span>
                    </Button>
                </div>

                <form.Subscribe selector={(s) => s.canSubmit}>
                    {(canSubmit) => (
                        <Button
                            type="submit"
                            disabled={!canSubmit}
                            className="w-full bg-white text-black hover:bg-white/90 hover:text-black hover:border border-border"
                        >
                            Verify OTP
                        </Button>
                    )}
                </form.Subscribe>
            </form>
        </div>
    );
};
