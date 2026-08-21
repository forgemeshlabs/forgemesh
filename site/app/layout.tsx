import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://forgemesh.io"),
  title: "ForgeMesh Labs — Paid APIs for AI Agents · x402 on Base",
  description:
    "Eight live x402 services for AI agents: notarization, anomaly detection, disruption intel, travel, voice, market signals, image generation. USDC per call on Base, from $0.001. No accounts, no API keys.",
  keywords: [
    "x402", "MCP servers", "paid APIs for AI agents", "agent commerce", "USDC micropayments",
    "Base mainnet", "autonomous agent economy", "machine-to-machine commerce", "agentic systems",
  ],
  authors: [{ name: "ForgeMesh Labs" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "ForgeMesh Labs — Paid APIs for AI Agents",
    description: "Eight live x402 services. USDC per call on Base, from $0.001. No accounts, no API keys.",
    type: "website",
    url: "https://forgemesh.io",
  },
  twitter: {
    card: "summary_large_image",
    site: "@forgemeshlabs",
    creator: "@forgemeshlabs",
    title: "ForgeMesh Labs — Paid APIs for AI Agents",
    description: "Eight live x402 services. USDC per call on Base, from $0.001. No accounts, no API keys.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        {/* First-party Umami analytics, proxied same-origin at /stats (see next.config rewrites). */}
        <script defer src="/stats/script.js" data-website-id="95646372-43dc-479e-a000-ab3cde688fd4" />
        {/* Outbound-click events: one delegated listener instead of per-link attributes,
            so blog CTAs and future links are covered automatically. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a||!window.umami)return;var h=a.href||'';var p=location.pathname;try{if(h.indexOf('npmjs.com')>-1){umami.track('npm-click',{pkg:h.split('/package/')[1]||h,from:p});}else if(h.indexOf('github.com')>-1){umami.track('github-click',{from:p});}else if(h.indexOf('kit.forgemesh.io')>-1){umami.track('kit-click',{from:p});}else if(a.pathname==='/scan'&&p!=='/scan'){umami.track('scan-link-click',{from:p});}else if(a.pathname==='/checklist'&&p!=='/checklist'){umami.track('checklist-link-click',{from:p});}}catch(_){}},true);`,
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
