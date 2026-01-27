import { Checkbox } from "@workspace/ui/components/checkbox";
import { humanizeEnum } from "@/lib/formatters";
import { useSuspenseDepartmentCodes } from "@/modules/courses/hooks/use-courses";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface CodeFilterProps {
    value?: string;
    onChange: (value: string | undefined) => void;
}

export const CodeFilter = ({ value, onChange }: CodeFilterProps) => {
    const { data: departmentCodes } = useSuspenseDepartmentCodes();

    const toggle = (code: string) => {
        onChange(value === code ? undefined : code);
    };

    return (
        <div className="flex flex-col gap-y-2">
            {departmentCodes.map((tag) => (
                <div
                    key={tag.id}
                    role="button"
                    tabIndex={0}
                    className="flex items-center justify-between cursor-pointer rounded-sm px-1 hover:bg-muted/50"
                    onClick={() => toggle(tag.code)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggle(tag.code);
                        }
                    }}
                >
                    <p className="text-sm">
                        {humanizeEnum(tag.code).toUpperCase()}
                    </p>

                    <Checkbox
                        checked={value === tag.code}
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={() => toggle(tag.code)}
                    />
                </div>
            ))}
        </div>
    );
};

export const CodeFilterSkeleton = () => {
    return (
        <div className="flex flex-col gap-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between"
                >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-4 rounded" />
                </div>
            ))}
        </div>
    );
};