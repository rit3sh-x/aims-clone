"use client";

import { SearchFilter } from "@/components/search-filter";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { useStudentParams } from "../../hooks/use-student-params";
import { CodeFilter } from "./code-filter";
import { YearFilter } from "./year-filter";

export const StudentFilters = () => {
    const [params, setParams] = useStudentParams();
    const { name, year } = params;

    const hasAnyFilters = !!(name || year);

    const updateSearch = (patch: Partial<typeof params>) => {
        setParams(patch);
    };

    const onClear = () => {
        setParams({
            name: "",
            year: null,
        });
    };

    const debouncedName = useDebouncedSearch(name, (value) =>
        updateSearch({ name: value })
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

            <SearchFilter title="Year">
                <YearFilter
                    value={year ?? undefined}
                    onChange={(value) => updateSearch({ year: value })}
                />
            </SearchFilter>

            <SearchFilter title="Department" className="border-b-0">
                <CodeFilter
                    value={debouncedName.value}
                    onChange={debouncedName.onChange}
                />
            </SearchFilter>
        </div>
    );
};
