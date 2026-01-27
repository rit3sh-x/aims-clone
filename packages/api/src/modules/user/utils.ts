import { fileTypeFromBuffer } from "file-type";
import { s3Service } from "@workspace/infra";

export const MAX_FILE_SIZE = 1 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set(["image/png", "image/webp", "image/jpeg"]);

export async function uploadUserProfileImage(params: {
    userId: string;
    bytes: ArrayBuffer;
}) {
    const { userId, bytes } = params;

    try {
        if (bytes.byteLength > MAX_FILE_SIZE) {
            throw new Error("Image size must be less than 5MB");
        }

        const buffer = Buffer.from(bytes);
        const size = buffer.byteLength;

        const detected = await fileTypeFromBuffer(buffer);
        const mimeType = detected?.mime;

        if (!mimeType || !ALLOWED_MIME_TYPES.has(mimeType)) {
            throw new Error(
                "Invalid image format. Only PNG, WEBP, JPEG allowed."
            );
        }

        const ext =
            mimeType === "image/jpeg"
                ? "jpg"
                : mimeType === "image/png"
                  ? "png"
                  : "webp";

        const key = `${userId}/profile.${ext}`;

        await s3Service.uploadFile({
            userId,
            key,
            body: buffer,
            contentType: mimeType,
        });

        return {
            key,
            mimeType,
            size,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        throw new Error("Failed to upload profile image");
    }
}

export async function removeUserProfileImage(params: {
    key: string;
    userId: string;
}) {
    const { key, userId } = params;

    try {
        await s3Service.deleteFile({ key, userId });
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to upload profile image");
    }
}
