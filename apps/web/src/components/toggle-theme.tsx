"use client";

import { useCallback, useRef, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "@workspace/ui/lib/utils";
import { useTheme } from "next-themes";

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
    duration?: number;
    mode?: "toggle" | "light" | "dark" | "system";
}

export function AnimatedThemeToggler({
    className,
    duration = 400,
    mode = "toggle",
    ...props
}: AnimatedThemeTogglerProps) {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [mounted] = useState(true);

    const runTransition = useCallback(
        (nextTheme: "light" | "dark") => {
            if (
                !buttonRef.current ||
                !document.startViewTransition ||
                resolvedTheme === nextTheme
            ) {
                setTheme(nextTheme);
                return;
            }

            const { top, left, width, height } =
                buttonRef.current.getBoundingClientRect();

            const x = left + width / 2;
            const y = top + height / 2;

            const maxRadius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            );

            const transition = document.startViewTransition(() => {
                flushSync(() => {
                    setTheme(nextTheme);
                });
            });

            transition.ready.then(() => {
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${maxRadius}px at ${x}px ${y}px)`,
                        ],
                    },
                    {
                        duration,
                        easing: "ease-in-out",
                        pseudoElement: "::view-transition-new(root)",
                    }
                );
            });
        },
        [resolvedTheme, setTheme, duration]
    );

    const handleClick = useCallback(() => {
        if (!mounted) return;

        if (mode === "light") return setTheme("light");
        if (mode === "dark") return setTheme("dark");
        if (mode === "system") return setTheme("system");

        const next = resolvedTheme === "dark" ? "light" : "dark";

        runTransition(next);
    }, [mode, resolvedTheme, runTransition, mounted, setTheme]);

    if (!mounted) return null;

    const icon =
        theme === "system" ? (
            <Monitor className="size-4" />
        ) : resolvedTheme === "dark" ? (
            <Sun className="size-4" />
        ) : (
            <Moon className="size-4" />
        );

    return (
        <button
            ref={buttonRef}
            type="button"
            onClick={handleClick}
            className={cn(
                "inline-flex items-center justify-center rounded-md transition-colors",
                className
            )}
            {...props}
        >
            {icon}
        </button>
    );
}
