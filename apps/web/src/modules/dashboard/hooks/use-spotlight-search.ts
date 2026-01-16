import { Route } from "@/routes/_dashboard";
import { useCallback, useEffect, useState } from "react";

interface SpotlightOptions {
    debounceMs?: number;
}

export const useSpotlightSearch = ({ debounceMs = 500 }: SpotlightOptions) => {
    const navigate = Route.useNavigate();
    const { search: searchQuery } = Route.useSearch();
    const [localSearch, setLocalSearch] = useState(searchQuery || "");

    useEffect(() => {
        setLocalSearch(searchQuery || "");
    }, [searchQuery]);

    useEffect(() => {
        if (localSearch === searchQuery) return;

        const timer = setTimeout(() => {
            navigate({
                search: (prev) => ({
                    ...prev,
                    search: localSearch,
                }),
                replace: true,
            });
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localSearch, searchQuery, debounceMs, navigate]);

    const clearSearch = useCallback(() => {
        setLocalSearch("");
        navigate({
            search: (prev) => ({ ...prev, search: "" }),
            replace: true,
        });
    }, [navigate]);

    return {
        searchValue: localSearch,
        onSearchChange: setLocalSearch,
        clearSearch,
    };
};
