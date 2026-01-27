"use client";

import { SearchFilter } from "@/components/search-filter";
import { CodeFilter, CodeFilterSkeleton } from "./code-filter";
import { NameFilter } from "./name-filter";
import { useCourseParams } from "../../../hooks/use-course-params";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { Suspense } from "react";

export const SemesterFilter = () => {
    const [params, setParams] = useCourseParams();

    const { departmentCode, name } = params;

    const hasAnyFilters = !!(name || departmentCode);

    const updateSearch = (patch: Partial<typeof params>) => {
        setParams(patch);
    };

    const onClear = () => {
        setParams({
            name: "",
            departmentCode: "",
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

            <SearchFilter title="Department">
                <Suspense fallback={<CodeFilterSkeleton />}>
                    <CodeFilter
                        value={departmentCode === "" ? undefined : departmentCode}
                        onChange={(value) => updateSearch({ departmentCode: value })}
                    />
                </Suspense>
            </SearchFilter>

            <SearchFilter title="Search" className="border-b-0">
                <NameFilter
                    value={debouncedName.value}
                    onChange={debouncedName.onChange}
                />
            </SearchFilter>
        </div>
    );
};
