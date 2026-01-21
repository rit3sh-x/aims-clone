import { useCallback, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "@workspace/ui/lib/utils";
import { useTheme } from "./provider";

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
    duration?: number;
}

export const AnimatedThemeToggler = ({
    className,
    duration = 600,
    ...props
}: AnimatedThemeTogglerProps) => {
    const { theme, setTheme } = useTheme();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current || !document.startViewTransition) {
            const newTheme = theme === "dark" ? "light" : "dark";
            setTheme(newTheme);
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
                const newTheme = theme === "dark" ? "light" : "dark";
                setTheme(newTheme);
            });
        });

        await transition.ready;

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
    }, [theme, setTheme, duration]);

    return (
        <button
            ref={buttonRef}
            onClick={toggleTheme}
            className={cn(className)}
            {...props}
        >
            {theme === "dark" ? (
                <Sun className="size-4" />
            ) : (
                <Moon className="size-4" />
            )}
        </button>
    );
};
