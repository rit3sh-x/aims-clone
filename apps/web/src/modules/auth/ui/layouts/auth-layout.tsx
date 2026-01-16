import { Outlet, useLocation } from "@tanstack/react-router";
import { AuthProvider, useAuthLayoutContext } from "../../context/auth-context";
import { Watchers } from "../components/watchers";
import { CollegeInfo } from "../components/college-info";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorUI } from "@/components/error-ui";
import { useEffect } from "react";

const AuthLayoutInner = () => {
    const { isTyping, passwordExist, showPassword, reset } =
        useAuthLayoutContext();
    const location = useLocation();

    useEffect(() => {
        reset();
    }, [location.pathname, reset]);

    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 p-6 bg-neutral-900">
            <div className="hidden lg:flex items-center justify-center bg-neutral-300 rounded-md h-full w-full overflow-hidden relative">
                <div className="absolute top-4 left-4 z-20">
                    <CollegeInfo />
                </div>
                <Watchers
                    isTyping={isTyping}
                    passwordExist={passwordExist}
                    showPassword={showPassword}
                />
            </div>

            <div className="flex items-center justify-center p-6 h-full w-full">
                <Outlet />
            </div>
        </div>
    );
};

export const AuthLayout = () => {
    return (
        <ErrorBoundary fallback={<ErrorUI />}>
            <AuthProvider>
                <AuthLayoutInner />
            </AuthProvider>
        </ErrorBoundary>
    );
};
