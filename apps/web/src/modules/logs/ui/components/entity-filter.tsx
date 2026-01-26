import { Checkbox } from "@workspace/ui/components/checkbox";
import { humanizeEnum } from "@/lib/formatters";
import { AUDIT_ENTITIES, type AuditEntity } from "../../constants";

interface EntityFilterProps {
    value?: AuditEntity;
    onChange: (value: AuditEntity | undefined) => void;
}

export const EntityFilter = ({ value, onChange }: EntityFilterProps) => {
    const toggle = (tag: AuditEntity) => {
        if (value === tag) {
            onChange(undefined);
        } else {
            onChange(tag);
        }
    };

    return (
        <div className="flex flex-col gap-y-2">
            {AUDIT_ENTITIES.map((tag) => (
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
