import { Input } from "@workspace/ui/components/input";
import { Dispatch, SetStateAction } from "react";

interface NameFilterProps {
    value?: string;
    onChange: Dispatch<SetStateAction<string>>;
    placeholder?: string;
}

export const NameFilter = ({
    value,
    onChange,
    placeholder = "Search by name…",
}: NameFilterProps) => {
    const handleChange = (raw: string) => {
        const trimmed = raw.trim();

        if (trimmed === "") {
            onChange("");
        } else {
            onChange(trimmed);
        }
    };

    return (
        <Input
            type="text"
            value={value ?? ""}
            placeholder={placeholder}
            onChange={(e) => handleChange(e.target.value)}
        />
    );
};
