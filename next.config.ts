import type { NextConfig } from "next";
import path from "path/win32";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['10.39.4.82'],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
