import type { NextConfig } from "next";

const backendBase = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8080"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  experimental: {
    // Disable the segment explorer devtool — it has a bug in Next.js 15 where
    // navigating to nested dynamic routes causes a RuntimeError:
    // "can't access property 'page.tsx', t.children is undefined"
    devtoolSegmentExplorer: false,
  },
  async rewrites() {
    if ((process.env.NEXT_PUBLIC_API_MODE ?? "mock") !== "backend") {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
