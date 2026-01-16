"use client";

import { ArrowUpRight, Search, Loader2Icon } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@workspace/ui/components/command";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSpotlightSearch } from "../../hooks/use-spotlight-search";
import { useSpotlight } from "../../hooks/use-spotlight";
import { useRouter } from "next/navigation";

// TODO remianing workflow

export const SpotlightSearch = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { searchValue, onSearchChange, clearSearch } = useSpotlightSearch({
        debounceMs: 500,
    });
    const { data: spotlightResult, isLoading } = useSpotlight();

    useEffect(() => {
        if (!open && searchValue) {
            clearSearch();
        }
    }, [open, searchValue, clearSearch]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            clearSearch();
        }
    };

    const hasSearchValue = searchValue.trim().length > 0;
    const hasResults =
        spotlightResult?.items &&
        Array.isArray(spotlightResult.items) &&
        spotlightResult.items.length > 0;
    const showEmptyState = hasSearchValue && !isLoading && !hasResults;
    const showResults = hasSearchValue && hasResults;
    const showDefaultCommands = !hasSearchValue && !isLoading;

    return (
        <>
            <button
                className="inline-flex h-9 md:min-w-lg w-fit rounded-full border border-input bg-background px-6 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
                onClick={() => setOpen(true)}
            >
                <span className="flex grow items-center">
                    <Search
                        className="-ms-1 me-3 text-muted-foreground/80"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    <span className="font-normal text-muted-foreground/70">
                        Search
                    </span>
                </span>
                <kbd className="-me-1 ms-12 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                    ⌘K
                </kbd>
            </button>
            <CommandDialog
                open={open}
                onOpenChange={handleOpenChange}
                showCloseButton={false}
                className="**:[data-slot=dialog-overlay]:backdrop-blur-xl **:data-[slot=dialog-content]:p-0"
            >
                <div className="relative">
                    <CommandInput
                        placeholder="Search..."
                        value={searchValue}
                        onValueChange={onSearchChange}
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 font-mono text-[0.625rem] font-medium text-muted-foreground">
                        ESC
                    </kbd>
                </div>
                <CommandList>
                    {isLoading && hasSearchValue && (
                        <div className="flex items-center justify-center py-6">
                            <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {showResults && (
                        <CommandGroup heading="Stocks">
                            {spotlightResult.items.map((item) => (
                                <CommandItem
                                    asChild
                                    key={item.stockId}
                                    value={`${item.stockId} ${item.name} ${item.sector ?? ""}`}
                                >
                                    <Link to="/">
                                        <div className="flex flex-col">
                                            <span className="font-medium truncate">
                                                {item.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate">
                                                {item.stockId} · {item.sector}
                                            </span>
                                        </div>
                                    </Link>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {showEmptyState && (
                        <CommandEmpty>No results found.</CommandEmpty>
                    )}

                    {showDefaultCommands && (
                        <CommandGroup heading="Navigation">
                            <CommandItem asChild>
                                <Link to={"/"}>
                                    <ArrowUpRight
                                        size={16}
                                        strokeWidth={2}
                                        className="opacity-60"
                                        aria-hidden="true"
                                    />
                                    <span>Go to dashboard</span>
                                </Link>
                            </CommandItem>
                            <CommandItem asChild>
                                <Link to={"/"}>
                                    <ArrowUpRight
                                        size={16}
                                        strokeWidth={2}
                                        className="opacity-60"
                                        aria-hidden="true"
                                    />
                                    <span>Manage Settings</span>
                                </Link>
                            </CommandItem>
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
};
