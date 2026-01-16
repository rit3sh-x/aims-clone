import { useState } from "react";
import { toast } from "sonner";
import {
    sendPasswordResetOtp,
    resetPasswordWithOtp,
} from "../../utils/auth-handlers";
import { ForgotPasswordForm } from "../components/forgot-password-form";
import { OtpForm, type OtpFormValues } from "../components/otp-form";
import { ResetPasswordForm } from "../components/reset-password-form";
import { AnimatePresence, motion } from "framer-motion";
import type { ForgotPasswordFormValues } from "../components/forgot-password-form";
import type { ResetPasswordFormValues } from "../components/reset-password-form";
import { useNavigate } from "@tanstack/react-router";

type ResetPasswordStep = "email" | "otp" | "password";

export const ResetPasswordView = () => {
    const [currentStep, setCurrentStep] = useState<ResetPasswordStep>("email");
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const navigate = useNavigate();

    const handleSendOtp = async ({ email }: ForgotPasswordFormValues) => {
        try {
            await sendPasswordResetOtp(email);
            setEmail(email);
            setCurrentStep("otp");
            toast.success("OTP sent to your email");
        } catch (error) {
            toast.error("Failed to send OTP", {
                description:
                    error instanceof Error ? error.message : "Please try again",
            });
        }
    };

    const handleVerifyOtp = async ({ otp }: OtpFormValues) => {
        setOtp(otp);
        setCurrentStep("password");
    };

    const handleResetPassword = async ({
        password,
    }: ResetPasswordFormValues) => {
        try {
            await resetPasswordWithOtp({
                email,
                otp,
                password,
                fetchOptions: {
                    onSuccess: () => {
                        navigate({ to: "/login" });
                    },
                    onError: ({ error }) => {
                        toast.error("Error", {
                            description:
                                error instanceof Error
                                    ? error.message
                                    : "Invalid OTP",
                        });
                    },
                },
            });
        } catch (error) {
            toast.error("Password reset failed", {
                description:
                    error instanceof Error ? error.message : "Please try again",
            });
        }
    };

    const handleResendOtp = async () => {
        try {
            await sendPasswordResetOtp(email);
            toast.success("OTP resent to your email");
        } catch (error) {
            toast.error("Failed to resend OTP");
        }
    };

    return (
        <div className="w-full h-full relative overflow-hidden">
            <AnimatePresence mode="wait">
                {currentStep === "email" && (
                    <motion.div
                        key="email"
                        className="w-full h-full flex items-center justify-center"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <ForgotPasswordForm onSubmit={handleSendOtp} />
                    </motion.div>
                )}
                {currentStep === "otp" && (
                    <motion.div
                        key="otp"
                        className="w-full h-full flex items-center justify-center"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <OtpForm
                            onSubmit={handleVerifyOtp}
                            onResend={handleResendOtp}
                        />
                    </motion.div>
                )}
                {currentStep === "password" && (
                    <motion.div
                        key="password"
                        className="w-full h-full flex items-center justify-center"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <ResetPasswordForm onSubmit={handleResetPassword} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
