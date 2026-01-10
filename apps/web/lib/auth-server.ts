import "server-only";
import { auth } from "@workspace/auth";
import { headers as getHeaders } from "next/headers";
import { cache } from "react";

export const getToken = cache(async () => {
    const headers = await getHeaders();
    const session = await auth.api.getSession({
        headers,
    });

    return session;
});