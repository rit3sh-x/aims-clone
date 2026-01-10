import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import { URL } from "url";

const bucket = process.env.S3_BUCKET ?? "";
const endpoint = process.env.S3_ENDPOINT;

function getMinioPattern(url?: string): RemotePattern | null {
  if (!url || !bucket) return null;

  const parsed = new URL(url);
  const protocol = parsed.protocol === "https:" ? "https" : "http";

  return {
    protocol,
    hostname: parsed.hostname,
    port: parsed.port || undefined,
    pathname: `/${bucket}/**`,
  };
}

function getAwsPattern(): RemotePattern | null {
  if (!bucket) return null;

  return {
    protocol: "https",
    hostname: `${bucket}.s3.amazonaws.com`,
    pathname: "/**",
  };
}

const imagePatterns = [
  getMinioPattern(endpoint),
  getAwsPattern(),
].filter((p): p is RemotePattern => Boolean(p));

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/tailwind-config"],
  images: {
    remotePatterns: imagePatterns,
  },
};

export default nextConfig;