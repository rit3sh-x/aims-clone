import { Input } from "@workspace/ui/components/input";
import { Dispatch, SetStateAction } from "react";

interface CodeFilterProps {
    value?: string;
    onChange: Dispatch<SetStateAction<string>>;
    placeholder?: string;
}

export const CodeFilter = ({
    value,
    onChange,
    placeholder = "Search by code…",
}: CodeFilterProps) => {
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
