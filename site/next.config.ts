import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  // First-party analytics: proxy Umami (localhost:3411) under /stats so the
  // tracker is same-origin (adblock-resistant) and works for x402swag.com too.
  async rewrites() {
    return [
      // Umami is built with BASE_PATH=/stats, so the prefix is forwarded as-is.
      { source: "/stats", destination: "http://127.0.0.1:3411/stats" },
      { source: "/stats/:path*", destination: "http://127.0.0.1:3411/stats/:path*" },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
