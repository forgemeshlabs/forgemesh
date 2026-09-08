import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { getFieldGuideOffer, fieldGuideSimulationDisclosure } from '@/lib/kronos-field-guide';
import { AlertSignup } from '@/components/CongressTrades';

// Price label switches by date; render per request so no rebuild is needed.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Build Your Own Kronos — Market-Intelligence & Paper-Trading Field Guide | ForgeMesh',
  description: 'Build your own Kronos market-intelligence and paper-trading system. An educational ebook and digital build package: two learning paths, 81 configuration fields, seven figures and the documented failures of our paper setup. Personal use. No support of any kind.',
  alternates: { canonical: 'https://forgemesh.io/kronos/field-guide' },
  openGraph: {
    title: 'Build your own Kronos — the Field Guide'
    description: 'Build your own Kronos market-intelligence, research and paper-trading system. Understand the settings, failures and evidence. Educational only. No support included.',
    url: 'https://forgemesh.io/kronos/field-guide',
    type: 'website',
  },
};

export default function KronosFieldGuidePage() {
  const fieldGuideOffer = getFieldGuideOffer();
  const canPurchase = true;
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen bg-[#f5f2e9] text-[#213c33]">
        <section className="bg-[#183c31] px-6 pb-20 pt-32 text-[#f8f3e5] sm:pt-40">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <Link href="/kronos" className="text-sm text-[#d7dfbd] underline underline-offset-4">Kronos / ForgeMesh</Link>
              <p className="mb-5 mt-10 text-xs uppercase tracking-[0.22em] text-[#c8d7bb]">For humans · ebook + digital build package</p>
              <h1 className="max-w-3xl font-serif text-5xl leading-[1.04] tracking-tight sm:text-7xl">The build kit that shows what broke.</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#e0e6d8]">Build your own Kronos market-intelligence and paper-trading system. Understand the settings, choose your rules, hand the brief to your coding agent, and learn from the failures in our own setup.</p>
              <Link href="/kronos/field-guide/preview" className="mt-6 inline-flex rounded-full border border-[#d7dfbd]/60 px-6 py-3 text-sm font-semibold text-[#f8f3e5] hover:bg-white/[0.07]">Read a free preview — Chapter 2 ↗</Link>
            </div>
            <aside className="rounded-3xl bg-white/[0.07] p-2">
              <div className="rounded-[18px] bg-[#234b3d] p-7">
                <p className="font-serif text-3xl">Your rules. Your research.</p>
                <ul className="mt-6 space-y-3 text-sm leading-6 text-[#e0e6d8]">
                  <li>PDF ebook and self-contained offline HTML</li>
                  <li>Two learning paths and two coding-agent briefs</li>
                  <li>81 explained settings, seven annotated figures</li>
                  <li>Sanitized data and offline validation tools</li>
                </ul>
                <p className="mt-7 text-sm font-semibold">Personal use · No redistribution · Sold as-is</p>
                <p className="mt-2 text-sm font-semibold">No support of any kind. No updates promised.</p>
                <a href="#purchase" className="mt-6 inline-flex rounded-full bg-[#f5f2e9] px-6 py-3 text-sm font-semibold text-[#183c31]">Read the purchase details ↓</a>
              </div>
            </aside>
          </div>
          <p className="mx-auto mt-12 max-w-6xl border-t border-white/20 pt-6 text-sm leading-6 text-[#e0e6d8]">Educational only. Not financial, investment, legal or tax advice. Trading can lose all committed capital; borrowing, shorting and derivatives can create additional liabilities. No forecast, stop or configuration guarantees protection or profit.</p>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#60734f]">Two ways into the same system</p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">Start with the knowledge you have.</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <article>
                <h3 className="font-serif text-2xl">New to finance or coding</h3>
                <p className="mt-4 leading-8">Learn what positions, exposure, stop-losses and short selling mean. Follow small worked examples, then give your coding agent a brief that asks you to choose your own settings.</p>
              </article>
              <article>
                <h3 className="font-serif text-2xl">Financially experienced</h3>
                <p className="mt-4 leading-8">Define a mandate, risk budget, execution policy and benchmark. Examine cost drag, overlapping evidence, calibration and replay fidelity. Coding experience is not assumed.</p>
              </article>
            </div>
            <p className="mt-10 max-w-4xl leading-8">Both paths include hardware and VM planning, a model-installation walkthrough, the official research-paper link, a paper-operation runbook and implementation acceptance scenarios. Model weights and upstream source are downloaded separately. The package is a specification and learning resource, not a finished trading application.</p>
          </div>
        </section>

        <section aria-labelledby="evidence-heading" className="bg-[#e8ecdf] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#60734f]">Frozen evidence · September 7, 2026</p>
            <h2 id="evidence-heading" className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">The losses and uncertainty stay in the record.</h2>
            <p className="mt-6 max-w-4xl leading-8">Our captured forecast outcomes show 49.8% directional accuracy, not a demonstrated profitable edge. The latest captured paper-account value was $94,840.62 versus an initial $100,000: a simple 5.2% difference below the start, not an audited or cash-flow-adjusted strategy return.</p>
            <div className="mt-8 rounded-3xl bg-[#dce3d2] p-2">
              <figure className="rounded-[18px] bg-[#f9f7f1] p-4 sm:p-7">
                <figcaption className="mb-5 text-sm font-semibold">Recorded paper-account observations — not actual investment returns</figcaption>
                {/* Original static figure; no remote source or tracking. */}
                <img src="/kronos-field-guide/paper-equity.svg" width="1100" height="420" alt="Paper-account observations from April to September 2026, including a May peak near $105,471 and an unresolved July trough near $65,104." className="h-auto w-full" />
                <p className="mt-5 text-sm leading-7">The raw log records a $40,367.32 peak-to-trough difference, but the lowest value rebounded the following hour. The trough remains unreconciled. It is not established as a war-caused realized loss. Lines break across observation gaps longer than six hours.</p>
                <p data-testid="simulation-disclosure" className="mt-5 text-sm leading-7"><strong>Simulated-performance disclosure:</strong> {fieldGuideSimulationDisclosure}</p>
              </figure>
            </div>
            <p className="mt-7 max-w-4xl leading-8">The case studies explain the trailing-peak reset bug, rejected broker orders, position deadlocks and a replay that could not reproduce the recorded decisions. Changing your settings changes your build and its outcomes. Copying ours does not promise the same results.</p>
          </div>
        </section>

        <section id="purchase" className="px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#60734f]">Read before purchasing</p>
              <h2 className="mt-4 font-serif text-4xl tracking-tight">A self-service educational purchase.</h2>
              <p className="mt-6 text-lg font-semibold">No support of any kind.</p>
              <p className="mt-3 leading-8">No installation help, debugging, configuration reviews, trading advice, calls, community access, maintenance, updates or response-time promise. You need to work independently or with your own coding agent. Third-party hosting, data and optional APIs may cost extra.</p>
              <p className="mt-5 leading-8">Personal, non-transferable use. No redistribution. Sold as-is, subject to non-excludable rights. Refunds follow the applicable checkout platform policy disclosed at purchase and mandatory law; no additional voluntary refund program is promised.</p>
              <a href="/kronos-field-guide/LICENSE.txt" className="mt-5 inline-block font-semibold underline underline-offset-4">Read the complete personal-use license and purchase terms</a>
            </div>
            <aside className="self-start rounded-3xl bg-[#e5eada] p-8">
              <h3 className="font-serif text-2xl">Kronos Field Guide</h3>
              <p className="mt-3 text-sm leading-7">Ebook + digital build package. One-time purchase; no subscription or publisher support.</p>
              {canPurchase ? (
                <>
                  <p className="mt-6 font-serif text-4xl">{fieldGuideOffer.priceLabel}{fieldGuideOffer.launch ? <span className="ml-3 align-middle text-base text-[#5b6b5f] line-through">$29</span> : null}</p>
                  {fieldGuideOffer.launchNote ? <p className="mt-2 text-sm font-semibold text-[#2f5a48]">{fieldGuideOffer.launchNote}</p> : null}
                  <p className="mt-4 text-sm font-semibold">Personal use only · No redistribution · No support of any kind</p>
                  <a href={fieldGuideOffer.checkoutUrl} data-umami-event="kronos-guide-checkout" data-umami-event-price={fieldGuideOffer.priceLabel} className="mt-6 inline-flex rounded-full bg-[#183c31] px-6 py-3 text-sm font-semibold text-[#fffdf7]">Continue to checkout · {fieldGuideOffer.priceLabel}</a>
                  <p className="mt-4 text-xs leading-6">Card checkout by Stripe. After payment you land on a download page (ZIP with the PDF, offline HTML and build package; up to 5 downloads within 72 hours). Review the final price, platform policy and terms before paying. No real-money trading application is included.</p>
                </>
              ) : (
                <p data-testid="checkout-pending" className="mt-6 rounded-xl bg-[#fffdf7] p-4 text-sm leading-7">Purchasing is not open yet. Price and checkout will appear here when available.</p>
              )}
              <p className="mt-6 text-xs leading-6">Educational only; not financial advice. Paper results do not predict live outcomes. No legal immunity or regulatory approval is claimed.</p>
              <div className="mt-6 border-t border-[#c8d0bc] pt-5">
                <p className="text-sm font-semibold">Not today? One email when the launch price ends and when the edition updates.</p>
                <div className="mt-3"><AlertSignup source="kronos-field-guide" buttonLabel="Notify me" doneMessage="Noted. One email when the launch price ends or the edition updates; nothing else." ariaLabel="Email for Kronos Field Guide notices" tone="light" /></div>
              </div>
            </aside>
          </div>
        </section>
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-6xl border-t border-[#c8d0bc] pt-8 text-sm leading-7">
            <p><strong>Affiliate disclosure:</strong> The guide contains optional DigitalOcean links through which GSD Contracts LLC / ForgeMesh may earn a commission. A non-affiliate alternative is provided. Infrastructure choices are optional and should follow your own requirements. No Alpaca referral relationship is represented.</p>
            <p className="mt-4">Need the agent API instead? <Link href="/kronos" className="underline underline-offset-4">Return to Kronos market intelligence.</Link></p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
