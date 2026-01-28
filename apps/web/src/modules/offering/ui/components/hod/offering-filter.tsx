"use client";

import { SearchFilter } from "@/components/search-filter";
import { NameFilter } from "./name-filter";
import { CodeFilter } from "./code-filter";
import { useOfferingParams } from "../../../hooks/use-offering-params";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";

export const OfferingFilter = () => {
    const [params, setParams] = useOfferingParams();

    const { name, code } = params;

    const hasAnyFilters = !!name || !!code;

    const updateSearch = (patch: Partial<typeof params>) => {
        setParams(patch);
    };

    const onClear = () => {
        setParams({
            name: undefined,
            code: undefined,
        });
    };

    const debouncedName = useDebouncedSearch(name, (value) =>
        updateSearch({ name: value })
    );

    const debouncedCode = useDebouncedSearch(code, (value) =>
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

            <SearchFilter title="Search by Name">
                <NameFilter
                    value={debouncedName.value}
                    onChange={debouncedName.onChange}
                />
            </SearchFilter>

            <SearchFilter title="Search by Code" className="border-b-0">
                <CodeFilter
                    value={debouncedCode.value}
                    onChange={debouncedCode.onChange}
                />
            </SearchFilter>
        </div>
    );
};
