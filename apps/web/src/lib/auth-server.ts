import "server-only";
import { auth } from "@workspace/auth";
import { headers as getHeaders } from "next/headers";

export type SessionResult = Awaited<ReturnType<typeof getToken>>;

export const getToken = async () => {
    const headers = await getHeaders();
    return auth.api.getSession({ headers });
};
