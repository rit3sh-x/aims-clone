import type { NextConfig } from "next";

const appUrl = new URL(process.env.NEXT_PUBLIC_APP_URL!);

const nextConfig: NextConfig = {
    transpilePackages: [
        "@workspace/ui",
        "@workspace/trpc",
        "@workspace/auth",
        "@workspace/db",
        "@workspace/infra",
    ],
    typedRoutes: true,
    images: {
        remotePatterns: [
            {
                protocol: appUrl.protocol.replace(":", "") as "http" | "https",
                hostname: appUrl.hostname,
                pathname: "/api/image/**",
            },
        ],
    },
};

export default nextConfig;
