import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ForgeMesh Labs — Infrastructure for Autonomous Execution",
  description:
    "ForgeMesh Labs builds protocol-grade systems for agent payments, orchestration, verification, and machine-to-machine commerce.",
  keywords: [
    "MCP servers", "x402 payments", "agent infrastructure", "autonomous execution",
    "AI tooling", "verifiable AI", "machine-to-machine commerce", "agentic systems",
  ],
  authors: [{ name: "ForgeMesh Labs" }],
  openGraph: {
    title: "ForgeMesh Labs — Infrastructure for Autonomous Execution",
    description: "Protocol-grade systems for agent payments, orchestration, and autonomous commerce.",
    type: "website",
    url: "https://forgemesh.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "ForgeMesh Labs",
    description: "Protocol-grade systems for agent payments, orchestration, and autonomous commerce.",
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
