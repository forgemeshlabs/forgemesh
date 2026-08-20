import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'The x402 Seller Pre-Flight Checklist — 10 Checks Before You List | ForgeMesh Labs',
  description:
    'Free 10-point checklist for x402 sellers, built from a census of all 1,225 Bazaar sellers and from running 17 paid services: 402 from outside, envelope validity, the 500-character cliff, GET vs POST, MPP dual-stack, and the checks that catch silent zero-revenue.',
  keywords: [
    'x402 checklist', 'x402 seller guide', 'x402 listing broken', 'payment-required header',
    'x402 envelope', 'x402 Bazaar listing', 'sell to AI agents checklist', 'MPP dual-stack',
  ],
  alternates: { canonical: '/checklist' },
  openGraph: {
    title: 'The x402 Seller Pre-Flight Checklist',
    description:
      '10 checks before you list — built from probing all 1,225 Bazaar sellers. One in four fail at least one of these.',
    type: 'article',
    url: 'https://forgemesh.io/checklist',
    images: ['/fm-nobg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/fm-nobg.png'],
    title: 'The x402 seller pre-flight checklist',
    description: '10 checks before you list. One in four sellers fail at least one.',
  },
};

const checks = [
  {
    title: 'Your listed URL answers a 402 from outside your network',
    body: 'Not a 200, not a 404, not a redirect. Test from a machine that isn’t yours — internal requests often bypass the proxy that agents actually hit. In our census, 206 sellers 404 and 40 serve their paid product free without knowing it.',
  },
  {
    title: 'The payment-required header decodes and validates',
    body: 'Base64-decode it: you need JSON with a numeric x402Version and a non-empty accepts[] array. This header is how an agent constructs the payment — a 402 without it is a paywall that names no price a machine can read.',
  },
  {
    title: 'Every accepts[] entry is complete',
    body: 'scheme, network (eip155:8453 for Base), asset (token contract), payTo (your wallet — checksum it), amount (atomic units as a string). Strict clients reject the entire offer over one missing field.',
  },
  {
    title: 'GET gets the challenge too, not just POST',
    body: 'If your routes are POST-only, a bare 405 on GET reads as "not a paid resource" to a discovering agent. Answer the same 402 + envelope on GET, even if only POST does the real work.',
  },
  {
    title: 'Your description is under 500 characters',
    body: 'The cliff is real and undocumented: one byte over and your listing becomes silently unpurchasable in the Bazaar. We measured it at exactly 500. Count bytes, not vibes.',
  },
  {
    title: 'Your listing is actually in the catalog',
    body: 'Check your resources appear in the Bazaar after registration and after every manifest change. Catalog purges happen without announcement — 43% of the catalog vanished overnight in July.',
  },
  {
    title: 'The listed URL and your live route agree exactly',
    body: 'Scheme, host (www vs apex), path, trailing slash, version prefix. Most dead listings aren’t dead services — they’re services that moved while the listing didn’t.',
  },
  {
    title: 'You never charge for your own failures',
    body: 'Upstream broke? Refund or don’t settle. An agent that pays for an error message doesn’t retry you — and its operator remembers.',
  },
  {
    title: 'Consider MPP dual-stack',
    body: 'A WWW-Authenticate: Payment challenge alongside your x402 envelope makes the same endpoint payable by MPP-speaking agents — same Base USDC settlement. 15% of sellers already answer both; they sell into two buyer pools with one endpoint.',
  },
  {
    title: 'Re-verify after every deploy',
    body: 'The most common failure we see isn’t a bad launch — it’s a silent regression: a middleware reorder or env change that never got re-tested from outside. Automate the check or make it a deploy ritual.',
  },
];

export default function ChecklistPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-16 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Free · seller checklist</span>
            </div>

            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              The x402 seller pre-flight checklist
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Ten checks before you list — and after every deploy. Built from{' '}
              <a href="/blog/x402-bazaar-health-census-august-2026" className="text-blue-400 hover:text-blue-300">
                probing all 1,225 Bazaar sellers
              </a>{' '}
              and running 17 paid services of our own. One in four sellers fail at least one of these, and almost none
              of them know.
            </p>

            <ol className="mt-10 space-y-4">
              {checks.map((c, i) => (
                <li key={i} className="flex gap-4 rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-blue-500/40 bg-blue-500/10 font-mono text-xs text-blue-300">
                    {i + 1}
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-slate-100">{c.title}</h2>
                    <p className="mt-1.5 text-sm leading-7 text-slate-400">{c.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
              <p className="text-base leading-7 text-slate-300">
                Items 1–4 and 9 take five seconds to verify:{' '}
                <strong className="text-slate-100">the free scanner runs them all at once</strong> and grades your
                endpoint A–F.
              </p>
              <a
                href="/scan"
                className="mt-4 inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Scan your endpoint free <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
