import { Checkbox } from "@workspace/ui/components/checkbox";
import { humanizeEnum } from "@/lib/formatters";
import { AUDIT_ACTIONS, type AuditAction } from "../../constants";

interface ActionsFilterProps {
    value?: AuditAction;
    onChange: (value: AuditAction | undefined) => void;
}

export const ActionsFilter = ({ value, onChange }: ActionsFilterProps) => {
    const toggle = (tag: AuditAction) => {
        if (value === tag) {
            onChange(undefined);
        } else {
            onChange(tag);
        }
    };

    return (
        <div className="flex flex-col gap-y-2">
            {AUDIT_ACTIONS.map((tag) => (
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
