import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable the segment explorer devtool — it has a bug in Next.js 15 where
    // navigating to nested dynamic routes causes a RuntimeError:
    // "can't access property 'page.tsx', t.children is undefined"
    devtoolSegmentExplorer: false,
  },
};

export default nextConfig;
