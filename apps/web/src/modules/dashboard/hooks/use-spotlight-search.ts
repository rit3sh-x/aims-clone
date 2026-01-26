import { useCallback, useEffect, useState } from "react";
import { useSpotlightParams } from "./use-spotlight-params";

interface SpotlightOptions {
    debounceMs?: number;
}

export const useSpotlightSearch = ({ debounceMs = 500 }: SpotlightOptions) => {
    const [{ search }, setParams] = useSpotlightParams();
    const [localSearch, setLocalSearch] = useState(search);

    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    useEffect(() => {
        const trimmed = localSearch.trim();

        if (trimmed === "" && search !== "") {
            setParams({ search: "" });
            return;
        }

        const timer = setTimeout(() => {
            if (trimmed !== search) {
                setParams({ search: trimmed });
            }
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localSearch, search, debounceMs, setParams]);

    const clearSearch = useCallback(() => {
        setLocalSearch("");
        setParams({ search: "" });
    }, [setParams]);

    return {
        searchValue: localSearch,
        onSearchChange: setLocalSearch,
        clearSearch,
    };
};
