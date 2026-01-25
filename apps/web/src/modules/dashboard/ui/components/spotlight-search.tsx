"use client";

import { ArrowUpRight, Loader2Icon } from "lucide-react";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@workspace/ui/components/command";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSpotlightSearch } from "../../hooks/use-spotlight-search";
import { useSpotlight } from "../../hooks/use-spotlight";

export const SpotlightSearch = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const { searchValue, onSearchChange, clearSearch } = useSpotlightSearch({
        debounceMs: 500,
    });

    const { data: spotlightResult, isLoading } = useSpotlight(searchValue);

    useEffect(() => {
        if (!open && searchValue) clearSearch();
    }, [open, searchValue, clearSearch]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((o) => !o);
            }
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const hasSearchValue = searchValue.trim().length > 0;
    const hasResults = (spotlightResult?.length ?? 0) > 0;

    return (
        <>
            <button
                className="inline-flex h-9 items-center justify-between md:min-w-lg w-fit rounded-full border px-6 py-2 text-sm"
                onClick={() => setOpen(true)}
            >
                <span className="text-muted-foreground">Search</span>
                <kbd className="text-xs">⌘K</kbd>
            </button>

            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                showCloseButton={false}
            >
                <Command>
                    <CommandInput
                        placeholder="SearchIcon..."
                        value={searchValue}
                        onValueChange={onSearchChange}
                    />

                    <CommandList className="max-h-150 overflow-y-auto scroll-smooth">
                        {isLoading && hasSearchValue && (
                            <div className="flex justify-center py-6">
                                <Loader2Icon className="h-5 w-5 animate-spin" />
                            </div>
                        )}

                        {hasSearchValue &&
                            hasResults &&
                            spotlightResult?.map((group) => (
                                <CommandGroup
                                    key={group.title}
                                    heading={group.title}
                                >
                                    {group.items.map((item) => (
                                        <CommandItem
                                            key={item.url}
                                            onSelect={() => {
                                                navigate({
                                                    to: `${item.url}/$`,
                                                });
                                                setOpen(false);
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <ArrowUpRight
                                                    size={14}
                                                    className="opacity-60"
                                                />
                                                <span className="truncate">
                                                    {item.field}
                                                </span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ))}

                        {hasSearchValue && !isLoading && !hasResults && (
                            <CommandEmpty>No results found.</CommandEmpty>
                        )}
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    );
};
