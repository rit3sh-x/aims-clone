import { Checkbox } from "@workspace/ui/components/checkbox";
import { humanizeEnum } from "@/lib/formatters";
import { SEMESTER_STATUS, type SemesterStatus } from "../../constants";

interface StatusFilterProps {
    value?: SemesterStatus;
    onChange: (value: SemesterStatus | undefined) => void;
}

export const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
    const toggle = (tag: SemesterStatus) => {
        if (value === tag) {
            onChange(undefined);
        } else {
            onChange(tag);
        }
    };

    return (
        <div className="flex flex-col gap-y-2">
            {SEMESTER_STATUS.map((tag) => (
                <div
                    key={tag}
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggle(tag)}
                >
                    <p className="text-sm">{humanizeEnum(tag)}</p>
                    <Checkbox
                        className="cursor-pointer"
                        checked={value === tag}
                        onCheckedChange={() => toggle(tag)}
                    />
                </div>
            ))}
        </div>
    );
};
