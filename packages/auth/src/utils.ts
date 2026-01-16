import { APIError } from "better-auth/api";
import { auth } from "./auth";
import type { MultiplePermissions } from "./permissions";

export const requirePermission = async (
    userId: string,
    permissions: MultiplePermissions
): Promise<void> => {
    const result = await auth.api.userHasPermission({
        body: { userId, permissions },
    });

    if (!result.success) {
        throw new APIError("FORBIDDEN", {
            message: "Insufficient permissions",
        });
    }
};

export const hasPermission = async (
    userId: string,
    permissions: MultiplePermissions
): Promise<boolean> => {
    try {
        const result = await auth.api.userHasPermission({
            body: { userId, permissions },
        });
        return result.success;
    } catch {
        return false;
    }
};
