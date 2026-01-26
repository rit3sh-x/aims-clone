"use client";

import { ArrowUpRightIcon, Loader2Icon } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Command,
} from "@workspace/ui/components/command";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSpotlightSearch } from "../../hooks/use-spotlight-search";
import { useSpotlight } from "../../hooks/use-spotlight";
import { SpotlightOutput } from "../../types";

export const SpotlightSearch = () => {
    const [open, setOpen] = useState(false);
    const { searchValue, onSearchChange, clearSearch } = useSpotlightSearch({
        debounceMs: 500,
    });
    const { data, isLoading } = useSpotlight();

    const spotlightResult: SpotlightOutput = data ?? [];

    useEffect(() => {
        if (!open && searchValue) {
            clearSearch();
        }
    }, [open, searchValue, clearSearch]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((prevOpen) => !prevOpen);
            }
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            clearSearch();
        }
    };

    const hasSearchValue = searchValue.trim().length > 0;
    const hasResults = spotlightResult.length > 0;
    const showEmptyState = hasSearchValue && !isLoading && !hasResults;
    const showResults = hasSearchValue && hasResults;
    const showDefaultCommands = !hasSearchValue && !isLoading;

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
                onOpenChange={handleOpenChange}
                showCloseButton={false}
            >
                <Command>
                    <CommandInput
                        placeholder="Search..."
                        value={searchValue}
                        onValueChange={onSearchChange}
                    />

                    <CommandList className="max-h-150 overflow-y-auto scroll-smooth">
                        {isLoading && hasSearchValue && (
                            <div className="flex justify-center py-6">
                                <Loader2Icon className="h-5 w-5 animate-spin" />
                            </div>
                        )}

                        {showResults &&
                            spotlightResult.map((group) => (
                                <CommandGroup
                                    key={group.title}
                                    heading={group.title}
                                >
                                    {group.items.map((item) => (
                                        <Link
                                            key={item.url}
                                            href={item.url}
                                            className="block"
                                            onClick={() => setOpen(false)}
                                        >
                                            <CommandItem value={item.url}>
                                                <div className="flex items-center gap-2">
                                                    <ArrowUpRightIcon
                                                        size={14}
                                                        className="opacity-60"
                                                    />
                                                    <span className="truncate">
                                                        {item.field}
                                                    </span>
                                                </div>
                                            </CommandItem>
                                        </Link>
                                    ))}
                                </CommandGroup>
                            ))}

                        {showEmptyState && (
                            <CommandEmpty>No results found.</CommandEmpty>
                        )}

                        {showDefaultCommands && (
                            <CommandGroup heading="Quick Actions">
                                <CommandItem>
                                    <span className="text-muted-foreground text-sm">
                                        Start typing to search...
                                    </span>
                                </CommandItem>
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    );
};