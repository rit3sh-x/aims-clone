"use client";

import { SearchFilter } from "@/components/search-filter";
import { NameFilter } from "./name-filter";
import { useDepartmentParams } from "../../hooks/use-department-params";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";

export const DepartmentFilters = () => {
    const [{ name }, setParams] = useDepartmentParams();

    const hasAnyFilters = Boolean(name);

    const {
        value: searchValue,
        onChange: onSearchChange,
        clear,
    } = useDebouncedSearch(name ?? "", (value) => setParams({ name: value }), {
        debounceMs: 400,
    });

    return (
        <div className="border rounded-md bg-card overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <p className="font-semibold text-sm">Filters</p>
                {hasAnyFilters && (
                    <button
                        className="underline cursor-pointer text-xs"
                        onClick={clear}
                        type="button"
                    >
                        Clear
                    </button>
                )}
            </div>

            <SearchFilter title="Search" className="border-b-0">
                <NameFilter
                    value={searchValue}
                    onChange={onSearchChange}
                    placeholder="Search departments…"
                />
            </SearchFilter>
        </div>
    );
};
