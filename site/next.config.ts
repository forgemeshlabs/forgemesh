import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  // First-party analytics: proxy Umami (localhost:3411) under /stats so the
  // tracker is same-origin (adblock-resistant) and works for x402swag.com too.
  // The Agent Shop moved to its own site on 2026-09-24.
  async redirects() {
    return [
      { source: "/wall", destination: "/botboard", permanent: true },
      { source: "/shop", destination: "https://tikbotshop.com/", permanent: true },
      { source: "/api/shop/catalog", destination: "https://tikbotshop.com/api/catalog", permanent: true },
      // x402 Verified moved from /partners/<slug> to /verified/<slug> on 2026-10-15; /partners now
      // lists real ecosystem partners only. Badge paths (/badge/x402/<slug>) are unchanged.
      { source: "/partners/:slug", destination: "/verified/:slug", permanent: true },
      // Short link printed in the unclaimed crawl's User-Agent. Operators who find it in their
      // access logs land on the claim guide tagged src=probe (logged to data/claim-hits.jsonl).
      { source: "/claim", destination: "/verified/claim?src=probe", permanent: false },
      // Per-origin form of the same link: the crawl sends /claim/<slug> so the operator lands on
      // their own row and the arrival log names the origin whose log produced the visit.
      { source: "/claim/:slug", destination: "/verified/claim?slug=:slug&src=probe", permanent: false },
    ];
  },
  async rewrites() {
    return [
      // Machine feed alias: /partners.json keeps working for existing consumers.
      { source: "/verified.json", destination: "/partners.json" },
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
          // HSTS: a year, no includeSubDomains (fleet subdomains are separate services) and no preload yet.
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Agent discovery: ARD v0.91 manifest, A2A agent card, llms.txt (probed by AgentProbe & co.)
          { key: "Link", value: '</.well-known/ard.json>; rel="ard", </.well-known/agent-card.json>; rel="agent-card"; type="application/a2a-agent-card+json", </llms.txt>; rel="llms-txt"; type="text/plain"' },
        ],
      },
    ];
  },
};

export default nextConfig;
