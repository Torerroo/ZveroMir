import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const apiHostname = new URL(apiUrl).hostname;

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: apiUrl.startsWith("https") ? "https" : "http",
        hostname: apiHostname,
        port: apiHostname === "localhost" ? "8080" : "",
        pathname: "/static/**",
      },
    ],
  },
};

export default nextConfig;
