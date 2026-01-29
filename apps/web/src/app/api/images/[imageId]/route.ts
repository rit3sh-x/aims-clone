import { NextRequest, NextResponse } from "next/server";
import { db, document } from "@workspace/db";
import { eq } from "drizzle-orm";
import {auth} from "@workspace/auth";
import { s3Service } from "@workspace/infra";

interface Props {
    params: Promise<{
        imageId: string;
    }>;
}

export async function GET(req: NextRequest, { params }: Props) {
    const session = await auth.api.getSession({
        headers: req.headers,
    });

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { imageId } = await params;

    try {
        const [fileRecord] = await db
            .select()
            .from(document)
            .where(eq(document.id, imageId));

        if (!fileRecord) {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            );
        }

        const file = await s3Service.getFile({ key: fileRecord.key });

        const headers = new Headers(req.headers);
        headers.set(
            "Content-Type",
            file.contentType ?? "application/octet-stream"
        );
        headers.set("Content-Length", file.contentLength?.toString() ?? "0");
        headers.set("ETag", file.etag ?? "");
        headers.set("Cache-Control", "public, max-age=31536000, immutable");

        return new NextResponse(file.body as BodyInit, { headers });
    } catch (error) {
        console.error("Error fetching file:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
