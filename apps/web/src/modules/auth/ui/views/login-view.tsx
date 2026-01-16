import { useState } from "react";
import { toast } from "sonner";
import {
    loginWithPassword,
    sendLoginOtp,
    verifyLoginOtp,
} from "../../utils/auth-handlers";
import { LoginForm, type LoginFormValues } from "../components/login-form";
import { OtpForm, type OtpFormValues } from "../components/otp-form";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";

export const LoginView = () => {
    const [showOtpForm, setShowOtpForm] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async ({ email, password }: LoginFormValues) => {
        try {
            const response = await loginWithPassword(email, password);

            if (response.error) {
                toast.error("Error", {
                    description: response.error.message,
                });
                return;
            }

            if (response.data && "twoFactorRedirect" in response.data) {
                void sendLoginOtp();
                setShowOtpForm(true);
            } else {
                toast.error("Error", {
                    description: "Failed to connect to server",
                });
            }
        } catch (error) {
            toast.error("Login failed", {
                description:
                    error instanceof Error
                        ? error.message
                        : "Please check your credentials",
            });
        }
    };

    const handleVerifyOtp = async ({ otp }: OtpFormValues) => {
        try {
            await verifyLoginOtp({
                code: otp,
                fetchOptions: {
                    onSuccess: () => {
                        navigate({ to: "/" });
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
            toast.error("OTP verification failed", {
                description:
                    error instanceof Error ? error.message : "Invalid OTP",
            });
        }
    };

    const handleResendOtp = async () => {
        try {
            await sendLoginOtp();
            toast.success("OTP resent to your email");
        } catch (error) {
            toast.error("Failed to resend OTP");
        }
    };

    return (
        <div className="w-full h-full relative overflow-hidden">
            <AnimatePresence mode="wait">
                {!showOtpForm ? (
                    <motion.div
                        key="login"
                        className="w-full h-full flex items-center justify-center"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <LoginForm onSubmit={handleLogin} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="otp"
                        className="w-full h-full flex items-center justify-center"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <OtpForm
                            onSubmit={handleVerifyOtp}
                            onResend={handleResendOtp}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
