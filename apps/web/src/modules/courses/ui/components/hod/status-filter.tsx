import { Checkbox } from "@workspace/ui/components/checkbox";
import { humanizeEnum } from "@/lib/formatters";
import { COURSE_STATUS, type CourseStatus } from "@/modules/courses/constants";

interface CourseStatusFilterProps {
    value?: CourseStatus;
    onChange: (value: CourseStatus | undefined) => void;
}

export const CourseStatusFilter = ({
    value,
    onChange,
}: CourseStatusFilterProps) => {
    const toggle = (tag: CourseStatus) => {
        if (value === tag) {
            onChange(undefined);
        } else {
            onChange(tag);
        }
    };

    return (
        <div className="flex flex-col gap-y-2">
            {COURSE_STATUS.map((tag) => (
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
