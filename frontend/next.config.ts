import type { NextConfig } from "next";

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL || "http://localhost:8080";
const staticHostname = new URL(staticUrl).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: staticUrl.startsWith("https") ? "https" : "http",
        hostname: staticHostname,
        port: staticHostname === "localhost" ? "8080" : "",
        pathname: "/static/**",
      },
    ],
  },
};

export default nextConfig;
