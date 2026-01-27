"use client";

import { SearchFilter } from "@/components/search-filter";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { useEnrollmentParams } from "../../hooks/use-enrollment-params";
import { CodeFilter } from "./code-filter";

export const StudentFilters = () => {
    const [params, setParams] = useEnrollmentParams();
    const { code } = params;

    const hasAnyFilters = Boolean(code);

    const updateSearch = (patch: Partial<typeof params>) => {
        setParams(patch);
    };

    const onClear = () => {
        setParams({
            code: undefined,
        });
    };

    const debouncedName = useDebouncedSearch(code, (value) =>
        updateSearch({ code: value })
    );

    return (
        <div className="border rounded-md bg-card overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <p className="font-semibold text-sm">Filters</p>
                {hasAnyFilters && (
                    <button
                        className="underline cursor-pointer text-xs"
                        onClick={onClear}
                        type="button"
                    >
                        Clear
                    </button>
                )}
            </div>

            <SearchFilter title="Department" className="border-b-0">
                <CodeFilter
                    value={debouncedName.value}
                    onChange={debouncedName.onChange}
                />
            </SearchFilter>
        </div>
    );
};
