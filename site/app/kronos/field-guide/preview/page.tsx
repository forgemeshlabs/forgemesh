import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { AlertSignup } from '@/components/CongressTrades';
import { getFieldGuideOffer } from '@/lib/kronos-field-guide';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Free preview: Kronos Field Guide | ForgeMesh',
  description: 'Read Chapter 2 of the Kronos Field Guide for free: what you are building, the vocabulary you need, and the deployment paths and gear the guide describes. Build your own Kronos market-intelligence system.',
  alternates: { canonical: 'https://forgemesh.io/kronos/field-guide/preview' },
  openGraph: {
    title: 'Free preview: Kronos Field Guide',
    description: 'Chapter 2 of the Kronos Field Guide, free to read. What you are building, the vocabulary, and the deployment paths.',
    url: 'https://forgemesh.io/kronos/field-guide/preview',
    type: 'article',
  },
};

const deploymentPaths = [
  {
    path: 'Your existing Mac or PC',
    what: 'Reading, replay and a small Kronos-mini observation experiment',
    allowance: 'Start by checking available memory; 8 GB total RAM may be constrained, 16 GB gives more working room. Allow 10–20 GB free disk for an initial Python/model workspace.',
    test: 'Load one model, forecast one symbol, then measure peak RAM and cycle time before increasing workload.',
  },
  {
    path: 'Small Linux VM for orchestration',
    what: 'Journals, scheduler and broker-paper integration; inference can remain on another machine',
    allowance: 'Illustrative 2 vCPU / 4 GiB RAM / 40+ GB disk allocation; not a validated all-in-one inference specification',
    test: 'Verify memory with your dependencies; ensure network failures between inference and execution fail safely.',
  },
  {
    path: 'Linux VM for a small all-in-one research setup',
    what: 'One model worker plus local journals and a small paper universe',
    allowance: 'Illustrative 4 vCPU / 8 GiB RAM / 80+ GB disk allocation; benchmark first',
    test: 'Confirm worst-case inference finishes before the next cycle without starving the independent protection worker.',
  },
  {
    path: 'Larger model / many assets / large sample batches',
    what: 'Deliberately expanded research',
    allowance: 'Size from measured CPU/RAM/VRAM demand; a GPU is optional and workload-dependent',
    test: 'Compare throughput and model quality separately. Measure cost per completed forecast, not only cost per machine-hour.',
  },
];

const glossary: { term: string; meaning: string; why: string }[] = [
  { term: 'Asset / symbol', meaning: 'The thing being observed, such as a stock or cryptocurrency', why: 'The same asset can have different symbol names at different providers' },
  { term: 'Position', meaning: 'How much of an asset you currently own', why: 'Several purchases can grow one position beyond your intended limit' },
  { term: 'Long', meaning: 'Owning an asset and benefiting if its price rises', why: 'Selling that asset closes or reduces your long' },
  { term: 'Short', meaning: 'Borrowing an asset to sell first and hoping to buy it back cheaper', why: 'This is not the same thing as a stop-loss, and is disabled in the template' },
  { term: 'Equity', meaning: 'Cash plus the marked value of positions, minus liabilities', why: 'It moves even when nothing is sold' },
  { term: 'Realized loss', meaning: 'Loss locked in through a completed sale', why: 'Different from a temporary mark on an open position' },
  { term: 'Unrealized loss', meaning: 'Current marked loss on something still held', why: 'Still economically important; may worsen before you can sell' },
  { term: 'Exposure', meaning: 'How much of the account is invested in a category', why: 'Multiple coins can all fall together' },
  { term: 'Drawdown', meaning: 'Decline from an earlier account peak', why: 'Recovering the same percentage does not restore the account' },
  { term: 'Candle / bar', meaning: "A period's opening, highest, lowest and closing price and volume", why: 'An hourly bar and a daily bar describe very different horizons' },
  { term: 'OHLCV', meaning: 'Open, high, low, close, volume', why: 'The market-history inputs used by the forecasting system' },
  { term: 'Spread', meaning: 'Gap between the best quoted buying and selling prices', why: 'Crossing it creates an execution cost' },
  { term: 'Slippage', meaning: 'Difference between expected and actual execution', why: 'It can get much worse when markets move fast' },
  { term: 'Liquidity', meaning: 'How easily an order can trade without moving the price much', why: 'A price on a screen does not guarantee a buyer for your quantity' },
  { term: 'Rebalance', meaning: 'Adjust holdings toward chosen target proportions', why: 'Doing it too often can turn a quiet strategy into a fee machine' },
  { term: 'Calibration', meaning: 'Comparing forecast uncertainty with actual outcomes', why: 'Model agreement with itself is not evidence it is correct' },
];

export default function KronosFieldGuidePreviewPage() {
  const offer = getFieldGuideOffer();
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen bg-[#f5f2e9] text-[#213c33]">
        <section className="bg-[#183c31] px-6 pb-16 pt-32 text-[#f8f3e5] sm:pt-40">
          <div className="mx-auto max-w-4xl">
            <Link href="/kronos/field-guide" className="text-sm text-[#d7dfbd] underline underline-offset-4">Kronos Field Guide</Link>
            <p className="mb-5 mt-8 text-xs uppercase tracking-[0.22em] text-[#c8d7bb]">Free preview · Chapter 2</p>
            <h1 className="max-w-3xl font-serif text-4xl leading-[1.08] tracking-tight sm:text-6xl">What you are building, and the words you'll need.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#e0e6d8]">Two full sections from the beginner path of the Kronos Field Guide, free to read. Launching soon.</p>
            <p className="mt-4 text-sm font-semibold text-[#e0e6d8]">No support of any kind is provided.</p>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold leading-7">Educational only; not financial advice. Start with pretend money. You can lose money even when every rule works as intended. Paper results do not promise live results.</p>

            <h2 className="mt-10 font-serif text-3xl tracking-tight">1. What you are building</h2>
            <p className="mt-5 leading-8">Imagine three separate jobs. One part watches past market prices and draws possible future prices: that is Kronos. A second part follows rules about when to buy, hold, reduce or close a position: that is the Prometheus-style strategy and risk layer. A third part sends orders to a broker and checks what actually filled. A coding agent can help build these parts, but a confident explanation from an agent does not prove that the software works or that its strategy makes money.</p>
            <p className="mt-5 leading-8">A forecast is a guess about a future price. An order is a request to buy or sell. A fill is a completed purchase or sale. Those are different events. The most damaging bugs can happen between an order being requested and a fill being confirmed.</p>
            <p className="mt-5 leading-8">The first version should only observe. The second should replay saved prices. The third may submit orders to a broker's paper account after you explicitly choose and accept your settings. This package does not switch you to a real-money account.</p>

            <h2 className="mt-12 font-serif text-3xl tracking-tight">2. The words people use</h2>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[#c8d0bc]">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#c8d0bc] bg-[#e8ecdf] text-xs uppercase tracking-[0.12em] text-[#60734f]">
                    <th className="px-4 py-3 font-semibold">Term</th>
                    <th className="px-4 py-3 font-semibold">Plain meaning</th>
                    <th className="px-4 py-3 font-semibold">Why it matters</th>
                  </tr>
                </thead>
                <tbody>
                  {glossary.map((row) => (
                    <tr key={row.term} className="border-b border-[#dde3d2] last:border-0">
                      <td className="px-4 py-3 align-top font-semibold">{row.term}</td>
                      <td className="px-4 py-3 align-top leading-6">{row.meaning}</td>
                      <td className="px-4 py-3 align-top leading-6 text-[#4d5f42]">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-10 rounded-2xl bg-[#e8ecdf] p-6 leading-8">The full guide continues with 81 configuration fields, the incident record and both coding-agent briefs.</p>
            <Link href="/kronos/field-guide" className="mt-6 inline-flex rounded-full bg-[#183c31] px-6 py-3 text-sm font-semibold text-[#fffdf7]">Read the full offer and license →</Link>
          </div>
        </section>

        <section aria-labelledby="deploy-heading" className="bg-[#e8ecdf] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#60734f]">From the guide's resources chapter</p>
            <h2 id="deploy-heading" className="mt-4 font-serif text-3xl tracking-tight">Choose a deployment path</h2>
            <p className="mt-5 leading-7">Hardware figures below are <strong>planning allowances, not measured Kronos minimums or throughput guarantees</strong>. Your model, history length, samples, assets, dependencies and concurrent processes determine actual requirements. A bigger computer does not establish a better investment strategy.</p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[#c8d0bc] bg-[#f9f7f1]">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#c8d0bc] text-xs uppercase tracking-[0.12em] text-[#60734f]">
                    <th className="px-4 py-3 font-semibold">Path</th>
                    <th className="px-4 py-3 font-semibold">What it is for</th>
                    <th className="px-4 py-3 font-semibold">Planning allowance</th>
                    <th className="px-4 py-3 font-semibold">What you must test</th>
                  </tr>
                </thead>
                <tbody>
                  {deploymentPaths.map((row) => (
                    <tr key={row.path} className="border-b border-[#dde3d2] last:border-0">
                      <td className="px-4 py-3 align-top font-semibold">{row.path}</td>
                      <td className="px-4 py-3 align-top leading-6">{row.what}</td>
                      <td className="px-4 py-3 align-top leading-6 text-[#4d5f42]">{row.allowance}</td>
                      <td className="px-4 py-3 align-top leading-6 text-[#4d5f42]">{row.test}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#4d5f42]">These are starting budgets, not purchasing recommendations or performance claims. No hardware is required just to read this guide.</p>
          </div>
        </section>

        <section aria-labelledby="gear-heading" className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 id="gear-heading" className="font-serif text-3xl tracking-tight">Gear we run this on</h2>
            <p className="mt-5 leading-8">The guide's always-on path describes a small always-on Mac or Raspberry Pi, an external SSD for the workspace, and a UPS so a scheduled stop can still fire during a power blip.</p>
            <a
              href="/go/amazon"
              target="_blank"
              rel="noopener noreferrer sponsored"
              data-umami-event="affiliate_click"
              data-umami-event-partner="amazon"
              data-umami-event-slot="field-guide-gear"
              className="mt-5 inline-flex rounded-full border border-[#183c31]/30 bg-[#183c31] px-6 py-3 text-sm font-semibold text-[#fffdf7]"
            >
              See our gear on Amazon ↗
            </a>
            <p className="mt-4 text-sm leading-7 text-[#4d5f42]">As an Amazon Influencer, ForgeMesh earns from qualifying purchases. Your price does not change.</p>
          </div>
        </section>

        <section aria-labelledby="hosting-heading" className="bg-[#e8ecdf] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 id="hosting-heading" className="font-serif text-3xl tracking-tight">Optional hosting: DigitalOcean</h2>
            <p className="mt-5 leading-8">
              <a
                href="/go/digitalocean"
                target="_blank"
                rel="noopener noreferrer sponsored"
                data-umami-event="affiliate_click"
                data-umami-event-partner="digitalocean"
                data-umami-event-slot="field-guide-resources"
                className="font-semibold underline underline-offset-4"
              >
                Compare DigitalOcean plans — affiliate link
              </a>
            </p>
            <p className="mt-3 leading-8">
              <a href="https://www.digitalocean.com/pricing/droplets" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
                Open DigitalOcean pricing directly — no affiliate referral
              </a>
            </p>
            <p className="mt-5 text-sm leading-7 text-[#4d5f42]">GSD Contracts LLC / ForgeMesh may earn a commission if you purchase through the affiliate link. A VM is optional; benchmark the computer you already own first.</p>
            <p className="mt-6 leading-8">Want the fundamentals first? <a href="https://kit.forgemesh.io/stack-basics" className="font-semibold underline underline-offset-4">Our free self-hosting course covers the VM and networking basics.</a></p>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-4xl border-t border-[#c8d0bc] pt-8 text-sm leading-7">
            <p>The full guide is {offer.priceLabel}{offer.launch ? ' at launch price through September 15, 2026, then $29' : ''}. <Link href="/kronos/field-guide" className="underline underline-offset-4">Read the full sales page and license</Link>, or go straight to <a href={offer.checkoutUrl} data-umami-event="kronos-guide-checkout" data-umami-event-price={offer.priceLabel} className="underline underline-offset-4">checkout</a>. No support of any kind is provided.</p>
            <div className="mt-8 rounded-2xl bg-[#e8ecdf] p-6">
              <p className="font-semibold">Not ready to buy? One email when the launch price ends and when the edition updates.</p>
              <div className="mt-3"><AlertSignup source="kronos-field-guide" buttonLabel="Notify me" doneMessage="Noted. One email when the launch price ends or the edition updates; nothing else." ariaLabel="Email for Kronos Field Guide notices" tone="light" /></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
