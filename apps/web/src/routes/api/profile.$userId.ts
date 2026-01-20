import { getToken } from "@/lib/auth/server";
import { createFileRoute } from "@tanstack/react-router";
import { db } from "@workspace/db";
import { s3Service } from "@workspace/infra";

export const Route = createFileRoute("/api/profile/$userId")({
    server: {
        handlers: {
            HEAD: async ({ params }) => {
                const token = await getToken();
                const { userId } = params;

                const isAdmin = token?.user.role === "ADMIN";

                if (!token || (!isAdmin && token.user.id !== userId)) {
                    return new Response(null, { status: 404 });
                }

                const doc = await db.query.document.findFirst({
                    where: (d, { and, eq }) =>
                        and(eq(d.userId, userId), eq(d.type, "PROFILE_IMAGE")),
                });

                if (!doc) {
                    return new Response(null, { status: 404 });
                }

                return new Response(null, {
                    headers: {
                        "Content-Type": doc.mimeType,
                        "Cache-Control": "private, max-age=300",
                        ETag: `"${doc.key}"`,
                    },
                });
            },

            GET: async ({ params, request }) => {
                const token = await getToken();
                const { userId } = params;

                const isAdmin = token?.user.role === "ADMIN";

                if (!token || (!isAdmin && token.user.id !== userId)) {
                    return new Response(null, { status: 404 });
                }

                const doc = await db.query.document.findFirst({
                    where: (d, { and, eq }) =>
                        and(eq(d.userId, userId), eq(d.type, "PROFILE_IMAGE")),
                });

                if (!doc) {
                    return new Response("Not Found", { status: 404 });
                }

                const etag = `"${doc.key}"`;
                const ifNoneMatch = request.headers.get("if-none-match");

                if (ifNoneMatch === etag) {
                    return new Response(null, { status: 304 });
                }

                const file = await s3Service.getFile({ key: doc.key });
                const stream = file.body.transformToWebStream();

                return new Response(stream, {
                    headers: {
                        "Content-Type": doc.mimeType,
                        "Cache-Control": "private, max-age=300",
                        ETag: etag,
                    },
                });
            },
        },
    },
});
