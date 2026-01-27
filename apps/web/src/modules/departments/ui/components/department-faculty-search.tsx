"use client";

import { useDepartmentParams } from "../../hooks/use-department-params";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { NameFilter } from "./name-filter";

export const DepartmentFacultySearch = () => {
    const [{ name }, setParams] = useDepartmentParams();

    const { value: searchValue, onChange: onSearchChange } = useDebouncedSearch(
        name ?? "",
        (value) => setParams({ name: value }),
        { debounceMs: 400 }
    );

    return (
        <NameFilter
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search faculty…"
        />
    );
};
