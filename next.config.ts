import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-expect-error - Turbopack config is not yet in the types
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
      },
    ],
  },
};

export default nextConfig;
