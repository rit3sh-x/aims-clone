import { Checkbox } from "@workspace/ui/components/checkbox";
import { humanizeEnum } from "@/lib/formatters";
import { ENROLLMENT_STATUS, type EnrollmentStatus } from "../../constants";

interface EnrollmentFilterProps {
    value?: EnrollmentStatus;
    onChange: (value: EnrollmentStatus | undefined) => void;
}

export const EnrollmentFilter = ({
    value,
    onChange,
}: EnrollmentFilterProps) => {
    const toggle = (tag: EnrollmentStatus) => {
        if (value === tag) {
            onChange(undefined);
        } else {
            onChange(tag);
        }
    };

    return (
        <div className="flex flex-col gap-y-2">
            {ENROLLMENT_STATUS.map((tag) => (
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
