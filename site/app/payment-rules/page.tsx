// Payment Rules Watch — the full tracking page: who is writing the rules
// for AI agent payments, the milestone timeline, what would actually
// threaten micro-pricing, and the live feed from scripts/rules-watch.js.
// Data in public/rules-watch.json; rendered per-request (force-dynamic)
// so daily collector runs appear without a rebuild.
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { RulesWatchList, type RulesWatchData } from '@/components/RulesWatch';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Payment Rules Watch — Agent Payment Standards | ForgeMesh',
  description:
    'Live tracker of who is writing the rules for AI agent payments: the Agentic Payments Alliance, Visa Trusted Agent Protocol, Mastercard Agent Pay — and whether anyone proposes pricing rules that would touch micro-priced x402 services.',
  alternates: { canonical: '/payment-rules' },
  openGraph: {
    title: 'Payment Rules Watch: who writes the rules for agent payments',
    description:
      'Tracking the Agentic Payments Alliance, card-network agent protocols, and every pricing-rule signal — checked daily, summarized weekly.',
    type: 'website',
    url: 'https://forgemesh.io/payment-rules',
  },
};

const MILESTONES = [
  {
    date: '2025-04-29',
    title: 'Mastercard announces Agent Pay',
    body: 'Verified AI agents transact on a consumer’s behalf using Agentic Tokens, an extension of Mastercard’s tokenization stack. Scope: agent identity and authorization on card rails.',
  },
  {
    date: '2025-10-14',
    title: 'Visa introduces the Trusted Agent Protocol',
    body: 'A cryptographic way for merchants to verify that a checkout request came from an approved agent rather than a bot — signed request data with timestamps and a nonce. Scope: agent authentication.',
  },
  {
    date: '2026-08-16',
    title: 'Stripe acquires OpenRouter (~$7B)',
    body: 'The payments giant buys the model-routing layer. Stripe’s Machine Payments Protocol carries a $0.01 crypto / $0.50 card floor per charge — rail economics, not regulation.',
  },
  {
    date: '2026-08-18',
    title: 'Rain launches the Agentic Payments Alliance',
    body: '26 companies — Visa, Mastercard, Fiserv, Circle, Solana among them — commit to shared standards for agent authorization, fraud detection, and loyalty. Circle (USDC’s issuer) is a founding member. No pricing scope.',
  },
  {
    date: '2026-09-03',
    title: 'This tracker goes live',
    body: 'Our analysis of the alliance and the rail data behind it is in the launch post. From here the feed below updates daily; a weekly digest lands in The Brief when there’s action.',
  },
];

function loadData(): RulesWatchData {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'rules-watch.json'), 'utf8'));
  } catch {
    return { lastChecked: null, pricingRulesDetected: false, counts: {}, entries: [] };
  }
}

export default function Page() {
  const { lastChecked, pricingRulesDetected, counts, entries } = loadData();

  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-12 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(244,63,94,0.08),transparent_30%)]" />
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Payment Rules Watch
                {lastChecked ? (
                  <>
                    {' '}&middot; checked <time dateTime={lastChecked}>{lastChecked.slice(0, 16).replace('T', ' ')} UTC</time>
                  </>
                ) : null}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              Who&rsquo;s writing the rules for agent payments
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Visa, Mastercard, Fiserv, Circle, and Solana are in one room drafting shared standards for
              how AI agents spend money. We sell to agents from half a cent a call, so we watch that room
              professionally. This page tracks every standards move — and one question above all:{' '}
              <span className="text-slate-200">is anyone, anywhere, proposing pricing rules?</span>{' '}
              The day that answer changes, this page and{' '}
              <a href="/brief" className="text-blue-400 hover:text-blue-300">The Brief</a> say so loudly.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 rounded border border-white/[0.08] bg-white/[0.03] px-4 py-3">
              {pricingRulesDetected ? (
                <>
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" aria-hidden />
                  <span className="text-sm font-medium text-rose-300">
                    Pricing-rule signal detected — flagged entries below
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden />
                  <span className="text-sm font-medium text-emerald-300/90">
                    Status: no agent-payment pricing rules proposed anywhere we watch
                  </span>
                </>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
              <span>{entries.length} tracked items</span>
              {counts.pricing ? <span className="text-rose-300/80">{counts.pricing} pricing signals</span> : null}
              {counts.rules ? <span className="text-amber-300/80">{counts.rules} standards moves</span> : null}
              <span>4 sources polled daily</span>
              <span>weekly digest in the brief</span>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">The story so far</h2>
            <ol className="mt-6 space-y-6 border-l border-white/[0.08] pl-6">
              {MILESTONES.map((m) => (
                <li key={m.date} className="relative">
                  <span className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full border border-blue-400/60 bg-[#050509]" aria-hidden />
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-blue-300/80">{m.date}</p>
                  <p className="mt-1 text-base font-medium text-slate-100">{m.title}</p>
                  <p className="mt-1 max-w-2xl text-sm leading-7 text-slate-400">{m.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm leading-7 text-slate-400">
              The full argument — why authorization standards help micro-priced services and what the
              settlement data says about each rail — is in the launch post:{' '}
              <a href="/blog/agentic-payments-alliance-circle-x402" className="text-blue-400 hover:text-blue-300">
                Visa and Mastercard are writing the agent payment rules. Circle is in the room. Breathe.
              </a>
            </p>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
              What would actually worry us
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded border border-rose-400/20 bg-rose-400/[0.04] p-4">
                <p className="text-sm font-medium text-rose-300">Pricing rules</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Any proposed floor, minimum fee, or fee schedule for agent transactions. None exist today.
                  The watcher flags these instantly, between digests.
                </p>
              </div>
              <div className="rounded border border-amber-400/20 bg-amber-400/[0.04] p-4">
                <p className="text-sm font-medium text-amber-300">Mandatory agent identity</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Identity standards are good for us — unless a closed registry becomes a gate on who may
                  sell to agents at all. We track scope creep.
                </p>
              </div>
              <div className="rounded border border-sky-400/20 bg-sky-400/[0.04] p-4">
                <p className="text-sm font-medium text-sky-300">Stablecoin rail exclusion</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Circle and Solana co-authoring the standards is the strongest signal USDC rails stay inside
                  the tent. If that changes, it shows up here.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Live feed</h2>
            <div className="mt-6">
              <RulesWatchList entries={entries} />
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-12">
          <div className="mx-auto max-w-4xl text-sm leading-7 text-slate-400">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">How this works</p>
            <p className="mt-3">
              Daily, we poll the syndication feeds of Payments Dive, Finextra, the Stripe blog, and CoinDesk,
              keep only agentic-payments coverage, and classify each item: pricing signal, standards move, or
              coverage. Pricing signals alert immediately; everything else rolls into a Monday digest in{' '}
              <a href="/brief" className="text-blue-400/80 hover:text-blue-300">The Brief</a> — posted only
              when there was action. Raw feed at{' '}
              <a href="/rules-watch.json" className="font-mono text-blue-400/80 hover:text-blue-300">/rules-watch.json</a>.
              Rail-level settlement data lives on the homepage{' '}
              <a href="/#rail-pulse" className="text-blue-400/80 hover:text-blue-300">Rail Pulse</a> strip.
            </p>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
