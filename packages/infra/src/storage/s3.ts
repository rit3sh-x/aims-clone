import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";

class S3Service {
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

    async getFile(params: { key: string }) {
        const res = await this.client.send(
            new GetObjectCommand({
                Bucket: this.bucket,
                Key: params.key,
            })
        );

        if (!res.Body) {
            throw new Error("❌ File not found");
        }

        return {
            body: res.Body,
            contentType: res.ContentType,
            contentLength: res.ContentLength,
            etag: res.ETag,
        };
    }

    getPublicUrl(params: { key: string }) {
        const encodedKey = encodeURIComponent(params.key).replace(/%2F/g, "/");

        if (this.endpoint) {
            const endpoint = this.endpoint.replace(/\/$/, "");

            if (this.forcePathStyle) {
                return `${endpoint}/${this.bucket}/${encodedKey}`;
            }

            return `${endpoint.replace("://", `://${this.bucket}.`)}/${encodedKey}`;
        }

        return `https://${this.bucket}.s3.amazonaws.com/${encodedKey}`;
    }

    async uploadFile(params: {
        userId: string;
        key: string;
        body: Buffer | Uint8Array;
        contentType: string;
        ACL?: "public-read";
    }) {
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: params.key,
                Body: params.body,
                ContentType: params.contentType,
                ...(params.ACL && {
                    ACL: params.ACL,
                }),
            })
        );
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

type GlobalS3 = {
    s3Service?: S3Service;
};

const globalForS3 = globalThis as unknown as GlobalS3;

export const s3Service =
    globalForS3.s3Service ?? (globalForS3.s3Service = new S3Service());
