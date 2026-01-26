import "server-only";
import { getToken } from "./auth-server";
import { redirect } from "next/navigation";
import { cache } from "react";

export const requireNoAuth = cache(async () => {
    const token = await getToken();
    if (token) {
        redirect("/");
    }
});

export const requireAuth = cache(async () => {
    const token = await getToken();
    if (!token) {
        redirect("/login");
    }
    return token;
});

export const requireAdmin = cache(async () => {
    const token = await getToken();
    if (!token || token.user.role !== "ADMIN") {
        redirect("/");
    }
    return token;
});