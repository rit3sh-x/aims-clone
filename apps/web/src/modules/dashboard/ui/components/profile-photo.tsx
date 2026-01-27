"use client";

import React, { useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from "@workspace/ui/components/modal";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
    useModifyUserProfileImage,
    useRemoveUserProfileImage,
} from "../../hooks/use-profile-image";
import { toast } from "sonner";

interface ProfilePhotoProps {
    open: boolean;
    image?: string | null;
    setImage: (url?: string | null) => void;
    onOpenChange: (open: boolean) => void;
    aspect?: number;
    maxSizeMB?: number;
    acceptedTypes?: string[];
}

export const ProfilePhoto = ({
    open,
    onOpenChange,
    aspect = 1,
    maxSizeMB = 1,
    acceptedTypes = ["jpeg", "jpg", "png", "webp"],
    image,
    setImage,
}: ProfilePhotoProps) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [photo, setPhoto] = useState<{ url: string; file: File | null }>({
        url: "",
        file: null,
    });
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null
    );
    const [error, setError] = useState("");

    const modifyProfileImage = useModifyUserProfileImage();
    const removeProfileImage = useRemoveUserProfileImage();

    const isPending =
        modifyProfileImage.isPending || removeProfileImage.isPending;

    const hasExistingImage = !!image;
    const hasNewImage = !!photo.file;

    const reset = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setPhoto({ url: image ?? "", file: null });
        setCroppedAreaPixels(null);
        setError("");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!ext || !acceptedTypes.includes(ext)) {
            setError("Unsupported file type");
            return;
        }

        if (file.size / (1024 * 1024) > maxSizeMB) {
            setError(`File too large (max ${maxSizeMB}MB)`);
            return;
        }

        setError("");
        setPhoto({ url: URL.createObjectURL(file), file });
    };

    const handleCropComplete = (_: Area, pixels: Area) => {
        setCroppedAreaPixels(pixels);
    };

    const handleSave = async () => {
        if (!photo.file || !croppedAreaPixels) return;

        try {
            const cropped = await getCroppedImg(photo.url, croppedAreaPixels);

            const formData = new FormData();
            formData.append("image", cropped.file);

            modifyProfileImage.mutate(formData, {
                onSuccess: ({ imageUrl }) => {
                    setImage(imageUrl);
                    onOpenChange(false);
                },
                onError: () => toast.error("Failed to upload image"),
            });
        } catch {
            toast.error("Image processing failed");
        }
    };

    const handleRemove = () => {
        removeProfileImage.mutate(undefined, {
            onSuccess: () => {
                setImage(null);
                onOpenChange(false);
            },
            onError: () => toast.error("Failed to remove image"),
        });
    };

    return (
        <Modal
            open={open}
            onOpenChange={(val) => {
                onOpenChange(val);
                if (val) {
                    setPhoto({ url: image ?? "", file: null });
                } else {
                    reset();
                }
            }}
        >
            <ModalContent className="md:max-w-md">
                <ModalHeader>
                    <ModalTitle>Profile Photo</ModalTitle>
                </ModalHeader>

                <ModalBody className="space-y-4 w-full md:px-0">
                    <Input
                        type="file"
                        accept="image/*"
                        disabled={isPending}
                        onChange={handleFileChange}
                        className="w-full"
                    />

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    {photo.url && (
                        <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg bg-muted">
                            <Cropper
                                image={photo.url}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={handleCropComplete}
                            />
                        </div>
                    )}
                </ModalBody>

                <ModalFooter className="flex flex-col-reverse gap-2 md:flex-row">
                    <Button
                        variant="outline"
                        disabled={isPending}
                        onClick={() => onOpenChange(false)}
                        className="flex-1 py-2"
                    >
                        Cancel
                    </Button>

                    {hasExistingImage && !hasNewImage ? (
                        <Button
                            variant="destructive"
                            disabled={isPending}
                            onClick={handleRemove}
                            className="flex-1 py-2"
                        >
                            Remove
                        </Button>
                    ) : (
                        <Button
                            disabled={!hasNewImage || isPending}
                            onClick={handleSave}
                            className="flex-1 py-2"
                        >
                            {isPending ? "Saving..." : "Save"}
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.crossOrigin = "anonymous";
        img.src = url;
    });

async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area
): Promise<{ url: string; file: Blob }> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas error");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) return reject();
                resolve({
                    url: URL.createObjectURL(blob),
                    file: blob,
                });
            },
            "image/jpeg",
            0.95
        );
    });
}
