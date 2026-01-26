import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: [
        "@workspace/ui",
        "@workspace/trpc",
        "@workspace/auth",
        "@workspace/db",
        "@workspace/infra",
    ],
    typedRoutes: true,
};

export default nextConfig;
