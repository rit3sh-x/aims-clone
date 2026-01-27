"use client";

import { SearchFilter } from "@/components/search-filter";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { useClassroomParams } from "../../hooks/use-classroom-params";
import { NameFilter } from "./name-filter";
import { TypeFilter } from "./type-filter";

export const ClassroomFilters = () => {
    const [params, setParams] = useClassroomParams();
    const { name, type} = params;

    const hasAnyFilters = !!(
        name ||
        type
    );

    const updateSearch = (patch: Partial<typeof params>) => {
        setParams(patch);
    };

    const onClear = () => {
        setParams({
            name: undefined,
            type: undefined,
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

            <SearchFilter title="Name">
                <NameFilter
                    value={debouncedName.value}
                    onChange={debouncedName.onChange}
                />
            </SearchFilter>

            <SearchFilter title="Type" className="border-b-0">
                <TypeFilter
                    value={type === "" ? undefined : (type as any)}
                    onChange={(value) => updateSearch({ type: value ?? "" })}
                />
            </SearchFilter>
        </div>
    );
};