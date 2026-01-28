"use client";

import { Calendar } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";

const MIN_YEAR = 2000;

interface YearFilterProps {
    value?: number;
    onChange: (year: number) => void;
    minYear?: number;
    maxYear?: number;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function YearFilter({
    value,
    onChange,
    minYear = MIN_YEAR,
    maxYear = new Date().getFullYear(),
    placeholder = "Select year",
    disabled = false,
    className,
}: YearFilterProps) {
    const years: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
        years.push(y);
    }

    return (
        <Select
            value={value?.toString() ?? null}
            onValueChange={(val) => {
                if (!val) return;
                onChange(parseInt(val, 10));
            }}
            disabled={disabled}
        >
            <SelectTrigger
                className={cn("w-full flex items-center gap-2", className)}
            >
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-75">
                {years.map((year: number) => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
