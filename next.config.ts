import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow PrincipleCard to load sketch illustrations from any HTTPS source.
    // Restrict this to specific domains once the image host is known.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
