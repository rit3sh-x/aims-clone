"use client";

import { useState } from "react";
import { FileUploader } from "@/components/file-upload";
import { validateCreateSchedulesCSV } from "../../schema/validator";
import { toast } from "sonner";
import { useCreateSchedule } from "../../hooks/use-schedule";
import { ScheduleList } from "../components/schedule-list";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Download } from "lucide-react";
import type { z } from "zod";
import type { createScheduleRowSchema } from "../../schema/schema";

export const AdminScheduleView = () => {
    const [parsedData, setParsedData] = useState<
        z.infer<typeof createScheduleRowSchema>[]
    >([]);
    const [isUploading, setIsUploading] = useState(false);
    const createSchedule = useCreateSchedule();

    const handleFileChange = async (files: File[]) => {
        if (files.length === 0) {
            setParsedData([]);
            return;
        }

        const file = files[0];

        if (!file) return;

        const validTypes = [
            "text/csv",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];

        if (!validTypes.includes(file.type) && !file.name.endsWith(".csv")) {
            toast.error("Please upload a valid CSV or Excel file");
            return;
        }

        setIsUploading(true);

        try {
            const text = await file.text();
            const { valid, errors } = await validateCreateSchedulesCSV(text);

            if (errors.length > 0) {
                errors.forEach((error) => {
                    toast.error(
                        `Row ${error.row}: ${error.errors.join(", ")}`,
                        {
                            duration: 5000,
                        }
                    );
                });
            }

            if (valid.length > 0) {
                setParsedData(valid);
                toast.success(`Successfully parsed ${valid.length} schedules`);
            } else {
                toast.error("No valid schedules found in the file");
                setParsedData([]);
            }
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to parse file"
            );
            setParsedData([]);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = () => {
        if (parsedData.length === 0) {
            toast.error("No schedules to upload");
            return;
        }

        createSchedule.mutate(
            { schedules: parsedData },
            {
                onSuccess: () => {
                    setParsedData([]);
                },
            }
        );
    };

    const handleDownloadTemplate = () => {
        const headers = [
            "courseCode",
            "roomCode",
            "dayOfWeek",
            "sessionType",
            "period",
            "effectiveFrom",
            "effectiveTo",
        ];

        const csvContent = headers.join(",");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "schedule_template.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Template downloaded successfully");
    };

    return (
        <div className="w-full px-4 lg:px-12 py-8 space-y-6 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-row-reverse items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={handleDownloadTemplate}
                        className="gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Download Template
                    </Button>
                </div>

                <Card className="p-6">
                    <FileUploader
                        maxFiles={1}
                        maxFileSize={10 * 1024 * 1024}
                        acceptedFileTypes={[
                            "text/csv",
                            "application/vnd.ms-excel",
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        ]}
                        onChange={handleFileChange}
                    />

                    {isUploading && (
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            Parsing file...
                        </div>
                    )}
                </Card>

                {parsedData.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {parsedData.length} schedule(s) ready to upload
                            </p>
                            <Button
                                onClick={handleSubmit}
                                disabled={
                                    createSchedule.isPending || isUploading
                                }
                            >
                                {createSchedule.isPending
                                    ? "Uploading..."
                                    : "Upload Schedules"}
                            </Button>
                        </div>

                        <ScheduleList data={parsedData} />
                    </div>
                )}
            </div>
        </div>
    );
};
