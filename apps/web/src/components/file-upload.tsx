"use client";

import { FileUpload } from "@ark-ui/react/file-upload";
import {
    FileText,
    X,
    File as FileIcon,
    FileArchive,
    FileSpreadsheet,
    Video,
    Headphones,
    Image,
} from "lucide-react";

type FileUploaderProps = {
    maxFiles?: number;
    maxFileSize?: number;
    acceptedFileTypes?: string[];
    defaultFiles?: File[];
    onChange?: (files: File[]) => void;
};

const getFileIcon = (file: File) => {
    const { type, name } = file;

    if (
        type.includes("pdf") ||
        name.endsWith(".pdf") ||
        type.includes("word") ||
        name.endsWith(".doc") ||
        name.endsWith(".docx")
    ) {
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }

    if (
        type.includes("zip") ||
        type.includes("archive") ||
        name.endsWith(".zip") ||
        name.endsWith(".rar")
    ) {
        return <FileArchive className="h-4 w-4 text-muted-foreground" />;
    }

    if (
        type.includes("excel") ||
        name.endsWith(".xls") ||
        name.endsWith(".xlsx")
    ) {
        return <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />;
    }

    if (type.startsWith("video/")) {
        return <Video className="h-4 w-4 text-muted-foreground" />;
    }

    if (type.startsWith("audio/")) {
        return <Headphones className="h-4 w-4 text-muted-foreground" />;
    }

    if (type.startsWith("image/")) {
        return <Image className="h-4 w-4 text-muted-foreground" />;
    }

    return <FileIcon className="h-4 w-4 text-muted-foreground" />;
};

export function FileUploader({
    maxFiles = 10,
    maxFileSize = 100 * 1024 * 1024,
    acceptedFileTypes,
    defaultFiles = [],
    onChange,
}: FileUploaderProps) {
    return (
        <FileUpload.Root
            maxFiles={maxFiles}
            maxFileSize={maxFileSize}
            accept={acceptedFileTypes}
            defaultAcceptedFiles={defaultFiles}
            onFileChange={(details) => {
                onChange?.(details.acceptedFiles);
            }}
            className="w-full space-y-4"
        >
            <FileUpload.Context>
                {({ acceptedFiles }) => (
                    <>
                        <FileUpload.Dropzone className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 px-6 py-12 transition-colors hover:bg-muted">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <div className="space-y-2 text-center">
                                <h3 className="text-sm font-medium text-foreground">
                                    Upload files
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Drag & drop or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Max {maxFiles} files • Up to{" "}
                                    {Math.round(maxFileSize / 1024 / 1024)}MB
                                </p>
                            </div>
                        </FileUpload.Dropzone>

                        {acceptedFiles.length > 0 && (
                            <div className="space-y-3">
                                <FileUpload.ItemGroup>
                                    {acceptedFiles.map((file) => (
                                        <FileUpload.Item
                                            key={file.name}
                                            file={file}
                                        >
                                            <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                                                    {file.type.startsWith(
                                                        "image/"
                                                    ) ? (
                                                        <FileUpload.ItemPreview type="image/*">
                                                            <FileUpload.ItemPreviewImage className="h-full w-full object-cover" />
                                                        </FileUpload.ItemPreview>
                                                    ) : (
                                                        getFileIcon(file)
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <FileUpload.ItemName className="truncate text-sm font-medium text-foreground" />
                                                    <FileUpload.ItemSizeText className="text-xs text-muted-foreground" />
                                                </div>

                                                <FileUpload.ItemDeleteTrigger className="flex h-6 w-6 items-center justify-center text-muted-foreground hover:text-foreground">
                                                    <X className="h-4 w-4" />
                                                </FileUpload.ItemDeleteTrigger>
                                            </div>
                                        </FileUpload.Item>
                                    ))}
                                </FileUpload.ItemGroup>

                                <FileUpload.ClearTrigger className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                                    Remove all files
                                </FileUpload.ClearTrigger>
                            </div>
                        )}
                    </>
                )}
            </FileUpload.Context>

            <FileUpload.HiddenInput />
        </FileUpload.Root>
    );
}
