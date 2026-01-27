import { Input } from "@workspace/ui/components/input";

interface YearFilterProps {
    value?: number;
    onChange: (value: number | undefined) => void;
}

const MIN_YEAR = 2000;
const MAX_YEAR = 2100;

export const YearFilter = ({ value, onChange }: YearFilterProps) => {
    const handleChange = (raw: string) => {
        if (raw === "") {
            onChange(undefined);
            return;
        }
        if (!/^\d+$/.test(raw)) return;
        const year = Number(raw);
        if (year < MIN_YEAR || year > MAX_YEAR) return;

        onChange(year);
    };

    return (
        <Input
            type="number"
            min={MIN_YEAR}
            max={MAX_YEAR}
            step={1}
            value={value ?? ""}
            placeholder="Year"
            onChange={(e) => handleChange(e.target.value)}
        />
    );
};
