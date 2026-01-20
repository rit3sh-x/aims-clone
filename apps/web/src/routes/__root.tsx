/// <reference types="vite/client" />
import type { QueryClient } from "@tanstack/react-query";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type * as React from "react";
import {
    createRootRouteWithContext,
    HeadContent,
    Outlet,
    Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { AppRouter } from "@workspace/api";
import { Toaster } from "@workspace/ui/components/sonner";
import { getThemeServerFn, Theme } from "@/theme/theme";
import appCss from "@/globals.css?url";
import { ThemeProvider } from "@/theme/provider";
import { ErrorUI } from "@/components/error-ui";
import { getToken } from "@/lib/auth/server";
import { Session } from "@workspace/auth";

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
    trpc: TRPCOptionsProxy<AppRouter>;
    session: Session | null;
}>()({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                name: "description",
                content: "AIMS academic portal for students and faculty",
            },
            { title: "AIMS – Academic Information Management System" },
        ],
        links: [
            { rel: "stylesheet", href: appCss },
            { rel: "icon", type: "image/png", href: "/logo.png" },
            { rel: "apple-touch-icon", href: "/logo.png" },
        ],
    }),
    beforeLoad: async () => {
        const session = await getToken();
        return {
            session,
        };
    },
    loader: () => getThemeServerFn(),
    component: RootComponent,
    notFoundComponent: ErrorUI,
});

function RootComponent() {
    const theme = Route.useLoaderData();
    return (
        <RootDocument theme={theme}>
            <Outlet />
        </RootDocument>
    );
}

interface RootDocumentProps {
    children: React.ReactNode;
    theme: Theme;
}

function RootDocument({ children, theme }: RootDocumentProps) {
    return (
        <html lang="en" suppressHydrationWarning className={theme}>
            <head>
                <HeadContent />
            </head>
            <body className="w-screen min-h-screen">
                <ThemeProvider theme={theme}>
                    {children}
                    <Toaster theme={theme} />
                </ThemeProvider>
                <TanStackRouterDevtools position="bottom-right" />
                <Scripts />
            </body>
        </html>
    );
}
