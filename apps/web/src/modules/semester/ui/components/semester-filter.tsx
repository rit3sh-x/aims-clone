"use client";

import { SearchFilter } from "@/components/search-filter";
import { StatusFilter } from "./status-filter";
import { TypeFilter } from "./type-filter";
import { YearFilter } from "./year-filter";
import { useSemesterParams } from "../../hooks/use-semester-params";

export const SemesterFilter = () => {
    const [params, setParams] = useSemesterParams();

    const { status, type, year } = params;

    const hasAnyFilters = !!(status === "" || type === "" || year);

    const updateSearch = (patch: Partial<typeof params>) => {
        setParams(patch);
    };

    const onClear = () => {
        setParams({
            status: "",
            type: "",
            year: null,
        });
    };

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

            <SearchFilter title="Semester Status">
                <StatusFilter
                    value={status === "" ? undefined : status}
                    onChange={(value) => updateSearch({ status: value })}
                />
            </SearchFilter>

            <SearchFilter title="Semester Type">
                <TypeFilter
                    value={type === "" ? undefined : type}
                    onChange={(value) => updateSearch({ type: value })}
                />
            </SearchFilter>

            <SearchFilter title="Year" className="border-b-0">
                <YearFilter
                    value={year ?? undefined}
                    onChange={(value) => updateSearch({ year: value })}
                />
            </SearchFilter>
        </div>
    );
};
