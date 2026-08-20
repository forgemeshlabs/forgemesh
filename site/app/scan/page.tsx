import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { ScanTool } from '@/components/ScanTool';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'x402 Endpoint Scanner — Can Agents Actually Pay You? | ForgeMesh Labs',
  description:
    'Free x402 endpoint health check: paste your URL, get an instant A–F grade on whether AI agents can actually complete a purchase — 402 challenge, payment envelope validity, MPP dual-stack. Built from the census that found one in four Bazaar sellers can’t take an agent’s money.',
  keywords: [
    'x402 scanner', 'x402 endpoint test', 'x402 health check', 'payment-required header',
    'x402 envelope validator', 'MPP dual-stack test', 'agent payments', 'x402 Bazaar', '402 paywall check',
  ],
  alternates: { canonical: '/scan' },
  openGraph: {
    title: 'x402 Endpoint Scanner — can agents actually pay you?',
    description:
      'Paste your x402 URL, get an instant A–F grade: 402 challenge, envelope validity, MPP dual-stack. One in four Bazaar sellers fail — check yours free.',
    type: 'website',
    url: 'https://forgemesh.io/scan',
    images: ['/fm-nobg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/fm-nobg.png'],
    title: 'Can agents actually pay your x402 endpoint?',
    description: 'Free instant A–F health grade: 402 challenge, envelope validity, MPP dual-stack.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ForgeMesh x402 Endpoint Scanner',
  url: 'https://forgemesh.io/scan',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free instant scan; full report with fixes $5' },
  publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
};

export default function ScanPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        <section className="relative px-6 pb-16 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Endpoint scanner</span>
            </div>

            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              Can agents actually pay you?
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              In our{' '}
              <a href="/blog/x402-bazaar-health-census-august-2026" className="text-blue-400 hover:text-blue-300">
                August census of all 1,225 x402 Bazaar sellers
              </a>
              , one in four couldn&apos;t complete a sale — dead URLs, paywalls that never fire, envelopes agents
              can&apos;t parse. Paste your endpoint. Find out in five seconds which side you&apos;re on.
            </p>

            <div className="mt-10">
              <ScanTool />
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-50">Three ways to use it</h2>
              <p className="mt-2 text-sm text-slate-500">Scan above, then upgrade from your result — every tier works on the URL you scanned.</p>
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="flex flex-col rounded border border-white/[0.08] bg-white/[0.02] p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Instant scan</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">Free</p>
                  <ul className="mt-4 grow space-y-2 text-sm leading-6 text-slate-400">
                    <li>A–F grade in five seconds</li>
                    <li>Top finding, plain English</li>
                    <li>Envelope + MPP dual-stack detection</li>
                    <li>10 scans per hour</li>
                  </ul>
                  <a href="#main-content" className="mt-5 inline-flex items-center gap-2 rounded border border-white/[0.12] px-4 py-2.5 text-sm text-slate-300 transition-all hover:border-blue-500/50 hover:text-white">
                    Scan above <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
                <div className="flex flex-col rounded border border-blue-500/40 bg-blue-500/[0.06] p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Full report</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">$5 <span className="text-base font-normal text-slate-400">once</span></p>
                  <ul className="mt-4 grow space-y-2 text-sm leading-6 text-slate-400">
                    <li>Every finding, not just the first</li>
                    <li>Exact fixes with code snippets</li>
                    <li>Your decoded payment terms</li>
                    <li>Permanent link — re-scans free on every load until you&apos;re green</li>
                  </ul>
                  <p className="mt-5 text-xs text-slate-500">Buy from your scan result above ↑</p>
                </div>
                <div className="flex flex-col rounded border border-emerald-500/40 bg-emerald-500/[0.05] p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/80">ForgeMesh Watch</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">$5<span className="text-base font-normal text-slate-400">/mo</span></p>
                  <ul className="mt-4 grow space-y-2 text-sm leading-6 text-slate-400">
                    <li>Your endpoint scanned every day</li>
                    <li>Email alert the moment the grade changes</li>
                    <li>Catches broken paywalls before they cost a week of silent zero-revenue</li>
                    <li>Cancel anytime</li>
                  </ul>
                  <p className="mt-5 text-xs text-slate-500">Buy from your scan result above ↑</p>
                </div>
              </div>

              <div className="mt-6 rounded border border-white/[0.06] bg-white/[0.02] p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">For agents · $0.05 per scan · no account</p>
                <pre className="mt-3 overflow-x-auto rounded bg-black/40 p-4 font-mono text-[12px] leading-6 text-slate-300">
{`POST https://x402.forgemesh.io/x402-endpoint-scan   (x402 + MPP)
{"url": "https://target-to-check.com/route"}`}
                </pre>
                <p className="mt-3 text-xs text-slate-500">
                  Free local version for MCP clients:{' '}
                  <code className="rounded bg-white/[0.06] px-1.5 py-0.5">npx @forgemeshlabs/x402-scan-mcp</code> — also
                  in the Bazaar as x402-paywall-check, validate-payment-envelope, and x402-endpoint-preflight.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
