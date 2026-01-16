import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import path from "node:path";

export class S3Service {
    private client: S3Client;
    private bucket: string;
    private endpoint?: string;
    private forcePathStyle: boolean;

    constructor() {
        const {
            S3_REGION,
            S3_BUCKET,
            S3_ACCESS_KEY,
            S3_SECRET_KEY,
            S3_ENDPOINT,
            S3_FORCE_PATH_STYLE,
        } = process.env;

        if (!S3_REGION || !S3_BUCKET || !S3_ACCESS_KEY || !S3_SECRET_KEY) {
            throw new Error("❌ Missing S3 env vars");
        }

        this.bucket = S3_BUCKET;
        this.endpoint = S3_ENDPOINT;
        this.forcePathStyle = S3_FORCE_PATH_STYLE === "true";

        this.client = new S3Client({
            region: S3_REGION,
            endpoint: S3_ENDPOINT,
            forcePathStyle: this.forcePathStyle,
            credentials: {
                accessKeyId: S3_ACCESS_KEY,
                secretAccessKey: S3_SECRET_KEY,
            },
        });
    }

    private makeKey(userId: string, originalName: string) {
        const ext = path.extname(originalName);
        const base = path.basename(originalName, ext).replace(/\s+/g, "_");
        return `${userId}/${base}_${Date.now()}${ext}`;
    }

    private getPublicUrl(key: string) {
        if (!this.endpoint) {
            return `https://${this.bucket}.s3.amazonaws.com/${key}`;
        }

        if (this.forcePathStyle) {
            return `${this.endpoint}/${this.bucket}/${key}`;
        }

        const u = new URL(this.endpoint);
        return `${u.protocol}//${this.bucket}.${u.host}/${key}`;
    }

    async uploadFile(params: {
        userId: string;
        originalName: string;
        body: Buffer | Uint8Array;
        contentType: string;
    }) {
        const key = this.makeKey(params.userId, params.originalName);

        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: params.body,
                ContentType: params.contentType,
                ACL: "public-read",
            })
        );

        return {
            key,
            url: this.getPublicUrl(key),
        };
    }

    async deleteFile(params: { key: string; userId: string }) {
        if (!params.key.startsWith(`${params.userId}/`)) {
            throw new Error("⛔ Access denied");
        }

        return this.client.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: params.key,
            })
        );
    }
}
