import { Checkbox } from "@workspace/ui/components/checkbox";
import { humanizeEnum } from "@/lib/formatters";
import { SEMESTER_TYPE, type SemesterType } from "../../constants";

interface TypeFilterProps {
    value?: SemesterType;
    onChange: (value: SemesterType | undefined) => void;
}

export const TypeFilter = ({ value, onChange }: TypeFilterProps) => {
    const toggle = (tag: SemesterType) => {
        if (value === tag) {
            onChange(undefined);
        } else {
            onChange(tag);
        }
    };

    return (
        <div className="flex flex-col gap-y-2">
            {SEMESTER_TYPE.map((tag) => (
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
