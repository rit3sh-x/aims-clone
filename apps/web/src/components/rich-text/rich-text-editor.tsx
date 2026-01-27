"use client";

import { useTheme } from "next-themes";
import { useCreateBlockNote } from "@blocknote/react";
import {
    BlockNoteView,
    lightDefaultTheme,
    darkDefaultTheme,
    Theme,
} from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { Skeleton } from "@workspace/ui/components/skeleton";

const shadcnTheme = {
    light: {
        ...lightDefaultTheme,
        colors: {
            ...lightDefaultTheme.colors,
            editor: {
                text: "hsl(var(--foreground))",
                background: "hsl(var(--background))",
            },
        },
    } as Theme,
    dark: {
        ...darkDefaultTheme,
        colors: {
            ...darkDefaultTheme.colors,
            editor: {
                text: "hsl(var(--foreground))",
                background: "hsl(var(--background))",
            },
            sideMenu: "hsl(var(--muted))",
        },
    } as Theme,
};

interface RichTextEditorProps {
    content?: any;
    onChange?: (json: any) => void;
    disabled?: boolean;
    className?: string;
}

export const RichTextEditor = ({
    content,
    onChange,
    disabled = false,
    className,
}: RichTextEditorProps) => {
    const { resolvedTheme } = useTheme();

    const editor = useCreateBlockNote({
        initialContent: Array.isArray(content) ? content : undefined,
    });

    return (
        <div
            className={`rounded-md border border-input bg-background ${className}`}
        >
            <BlockNoteView
                editor={editor}
                editable={!disabled}
                onChange={() => onChange?.(editor.document)}
                theme={
                    resolvedTheme === "dark"
                        ? shadcnTheme.dark
                        : shadcnTheme.light
                }
                slashMenu={!disabled}
                sideMenu={!disabled}
                formattingToolbar={!disabled}
                className="min-h-[150px]"
            />
        </div>
    );
};

export const EditorSkeleton = () => (
    <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
    </div>
);
