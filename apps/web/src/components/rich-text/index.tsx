"use client";

import dynamic from "next/dynamic";
import { EditorSkeleton } from "./rich-text-editor";

export const RichText = dynamic(
    () => import("./rich-text-editor").then((mod) => mod.RichTextEditor),
    {
        ssr: false,
        loading: () => <EditorSkeleton />
    }
);
