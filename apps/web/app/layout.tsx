import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Merriweather } from "next/font/google";

import { cloakSSROnlySecret } from "ssr-only-secrets";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { headers as getHeaders } from "next/headers";
import { ThemeProvider } from "@/providers/theme";
import { Toaster } from "@workspace/ui/components/sonner";
import "@workspace/ui/globals.css";
import { TRPCReactProvider } from "@/trpc/client";

const fontSans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const fontMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

const fontSerif = Merriweather({
    subsets: ["latin"],
    weight: ["300", "400", "700"],
    variable: "--font-serif",
    display: "swap",
});

export const metadata: Metadata = {
    title: "AIMS",
    icons: {
        icon: "/logo.png",
    },
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const headers = await getHeaders();
    const cookie = headers.get("cookie");
    const encryptedCookie = await cloakSSROnlySecret(
        cookie ?? "",
        "SECRET_CLIENT_COOKIE_VAR"
    );

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${fontSans.variable} ${fontMono.variable} ${fontSerif.variable} font-sans antialiased`}
            >
                <TRPCReactProvider ssrOnlySecret={encryptedCookie}>
                    <NuqsAdapter>
                        <ThemeProvider>
                            {children}
                        </ThemeProvider>
                        <Toaster />
                    </NuqsAdapter>
                </TRPCReactProvider>
            </body>
        </html>
    );
};

export default Layout;