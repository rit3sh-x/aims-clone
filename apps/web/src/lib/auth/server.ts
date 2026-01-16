import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@workspace/auth";

export type SessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;

export const getToken = createServerFn({
    method: "GET",
}).handler(async (): Promise<SessionResult> => {
    const headers = new Headers(getRequestHeaders());
    return auth.api.getSession({ headers });
});
