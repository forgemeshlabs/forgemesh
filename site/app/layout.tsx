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
