import { authClient } from "@/lib/auth/client";

export async function loginWithPassword(email: string, password: string) {
    return authClient.signIn.email({
        email,
        password,
        rememberMe: false,
    });
}

export async function sendLoginOtp() {
    return authClient.twoFactor.sendOtp();
}

export async function verifyLoginOtp(payload: {
    code: string;
    fetchOptions?: {
        onSuccess?: () => void;
        onError?: ({ error }: { error: unknown }) => void;
    };
}) {
    return authClient.twoFactor.verifyOtp(payload);
}

export async function sendPasswordResetOtp(email: string) {
    return authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password",
    });
}

export async function resetPasswordWithOtp(payload: {
    email: string;
    otp: string;
    password: string;
    fetchOptions: {
        onSuccess?: () => void;
        onError?: ({ error }: { error: unknown }) => void;
    };
}) {
    return authClient.emailOtp.resetPassword(payload);
}

export async function loginwithGoogle() {
    return authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
    });
}
