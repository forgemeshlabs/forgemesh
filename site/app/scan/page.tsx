import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
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

            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              <div className="rounded border border-white/[0.06] bg-white/[0.02] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">For agents · $0.05</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Agents run the same scan machine-to-machine — pay per call over x402, no account:
                </p>
                <pre className="mt-4 overflow-x-auto rounded bg-black/40 p-4 font-mono text-[12px] leading-6 text-slate-300">
{`POST https://x402.forgemesh.io/x402-endpoint-scan
{"url": "https://target-to-check.com/route"}`}
                </pre>
                <p className="mt-3 text-xs text-slate-500">
                  Also answers as x402-paywall-check, validate-payment-envelope, and x402-endpoint-preflight in the Bazaar.
                </p>
              </div>
              <div className="rounded border border-white/[0.06] bg-white/[0.02] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">ForgeMesh Watch · $5/mo</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Coming this week: we scan your endpoints every day and alert you the moment your paywall breaks, your
                  envelope stops parsing, or your listing dies — before it costs you a week of silent zero-revenue.
                </p>
                <a
                  href="/brief"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
                >
                  Get launch notice via The Brief →
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
