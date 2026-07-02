import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ForgeMesh Labs - MCP and x402 Agent Commerce",
  description:
    "ForgeMesh Labs publishes MCP servers, x402-paid APIs, commercial intelligence services, affiliate routing, and machine-readable discovery surfaces for agent commerce.",
  keywords: [
    "MCP servers", "x402 payments", "agent commerce", "autonomous agent economy",
    "AI tooling", "commercial intelligence", "machine-to-machine commerce", "agentic systems",
  ],
  authors: [{ name: "ForgeMesh Labs" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "ForgeMesh Labs - MCP and x402 Agent Commerce",
    description: "Production-running MCP servers, x402-paid APIs, affiliate routing, and machine-readable discovery surfaces.",
    type: "website",
    url: "https://forgemesh.io",
  },
  twitter: {
    card: "summary_large_image",
    site: "@forgemeshlabs",
    creator: "@forgemeshlabs",
    title: "ForgeMesh Labs",
    description: "MCP servers, x402-paid APIs, affiliate routing, and machine-readable discovery surfaces for agent commerce.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
