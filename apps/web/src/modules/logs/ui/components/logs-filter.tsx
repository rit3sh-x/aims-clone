"use client";

import { SearchFilter } from "@/components/search-filter";
import { ActionsFilter } from "./actions-filter";
import { EntityFilter } from "./entity-filter";
import { DateRangePicker } from "@/components/date-range-picker";
import { useLogsParams } from "../../hooks/use-logs-params";

export const LogsFilters = () => {
    const [params, setParams] = useLogsParams();

    const { action, entity, dateFrom, dateTo } = params;

    const hasAnyFilters = !!(action === "" || entity === "" || dateFrom || dateTo);

    const updateSearch = (patch: Partial<typeof params>) => {
        setParams(patch);
    };

    const onClear = () => {
        setParams({
            action: "",
            entity: "",
            dateFrom: null,
            dateTo: null,
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


            <SearchFilter title="Action Type">
                <ActionsFilter
                    value={action === "" ? undefined : action}
                    onChange={(value) => updateSearch({ action: value })}
                />
            </SearchFilter>

            <SearchFilter title="Entity Category">
                <EntityFilter
                    value={entity === "" ? undefined : entity}
                    onChange={(value) => updateSearch({ entity: value })}
                />
            </SearchFilter>

            <SearchFilter title="Date Range" className="border-b-0">
                <DateRangePicker
                    range={{
                        from: dateFrom ?? undefined,
                        to: dateTo ?? undefined
                    }}
                    setRange={(range) => updateSearch({
                        dateFrom: range?.from ?? null,
                        dateTo: range?.to ?? null,
                    })}
                />
            </SearchFilter>
        </div>
    );
};
