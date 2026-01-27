import { Checkbox } from "@workspace/ui/components/checkbox";
import { humanizeEnum } from "@/lib/formatters";
import { CLASSROOMS, type ClassroomType } from "../../constants";

interface TypeFilterProps {
    value?: ClassroomType;
    onChange: (value: ClassroomType | undefined) => void;
}

export const TypeFilter = ({ value, onChange }: TypeFilterProps) => {
    const toggle = (tag: ClassroomType) => {
        if (value === tag) {
            onChange(undefined);
        } else {
            onChange(tag);
        }
    };

    return (
        <div className="flex flex-col gap-y-2">
            {CLASSROOMS.map((tag) => (
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
