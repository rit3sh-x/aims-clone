import "server-only";
import { getToken } from "./auth-server";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { UserRole } from "@workspace/db";

const requireRole = (allowedRoles: readonly UserRole[]) =>
    cache(async () => {
        const token = await getToken();

        if (!token) {
            redirect("/login");
        }

        if (!allowedRoles.includes(token.user.role)) {
            redirect("/");
        }

        return token;
    });

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

export const requireAdmin = requireRole(["ADMIN"]);
export const requireHOD = requireRole(["HOD"]);
export const requireAdvisor = requireRole(["ADVISOR"]);
export const requireInstructor = requireRole(["INSTRUCTOR"]);
export const requireStudent = requireRole(["STUDENT"]);
