import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Merriweather } from "next/font/google";
import { ThemeProvider } from "@/providers/theme";
import { Toaster } from "@workspace/ui/components/sonner";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["300", "400", "700"],
    variable: "--font-serif",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "AIMS – Academic Information Management System",
        template: "%s | AIMS",
    },
    description: "AIMS academic portal for students and faculty",

    icons: {
        icon: "/logo.png",
        apple: "/logo.png",
    },

    applicationName: "AIMS",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`min-h-screen w-screen flex overflow-hidden antialiased bg-sidebar ${inter.variable} ${jetbrainsMono.variable} ${merriweather.variable}`}
            >
                <NuqsAdapter>
                    <TRPCReactProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                            <Toaster />
                        </ThemeProvider>
                    </TRPCReactProvider>
                </NuqsAdapter>
            </body>
        </html>
    );
};

export default Layout;
