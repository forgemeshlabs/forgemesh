import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'About ForgeMesh Labs',
  description:
    'ForgeMesh Labs builds pay-per-call APIs and tools for AI agents, plus kits and guides for the people building them. One operator, 19 live paid services, everything self-serve.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About ForgeMesh Labs',
    description: 'Pay-per-call APIs and tools for AI agents, run by one person in Texas.',
    url: 'https://forgemesh.io/about',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

const UPDATED = '2026-09-09';

const FACTS: Array<[string, string]> = [
  ['Legal entity', 'GSD Contracts LLC, Texas'],
  ['Brand', 'ForgeMesh Labs'],
  ['Team', 'One owner-operator, no staff, no outside capital'],
  ['Live paid services', '19 surfaces on the x402 standard, USDC on Base'],
  ['Open source', '20 MCP servers in the official registry'],
  ['Customers', 'AI agents (per call) and the developers building them (kits, guides)'],
  ['Contact', 'hello@forgemesh.io'],
];

const MILESTONES: Array<[string, string]> = [
  ['Apr 2026', 'First x402 service live on Base mainnet. No accounts, no API keys, pay per call.'],
  ['Jul 2026', 'Fleet passes 10 services. Starter kit goes on sale: turn any API into a paid one in an afternoon.'],
  ['Aug 2026', 'Bazaar health census: all 1,225 sellers probed and published. MPP dual-stack on every 402.'],
  ['Sep 2026', 'An autonomous agent buys a physical T-shirt from x402swag.com, pays on-chain, ships. First agent-paid physical order we know of.'],
  ['Sep 2026', 'Kronos Field Guide launches. Photo-to-preset transforms and framed prints go live for agents. First inbound ecosystem grant offer.'],
];

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen bg-[#050509] text-slate-100">
        <section className="px-6 pb-16 pt-28 sm:pt-36">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                About · updated {UPDATED}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-slate-50 sm:text-5xl">
              Picks and shovels for the AI-agent economy.
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-400">
              ForgeMesh Labs builds the things AI agents pay for and the things their builders need.
              Nineteen live API services answer one question at a time for a fraction of a cent in USDC:
              decode a VIN, look up a government contract, score a market signal, generate an image,
              speak a sentence. No signup, no API key, no subscription. Alongside them: a starter kit,
              a field guide, free tools, and twenty open-source MCP servers for the people building
              those agents.
            </p>

            <div className="mt-12 space-y-10 text-[15px] leading-7 text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-slate-50">At a glance</h2>
                <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-[180px_1fr]">
                  {FACTS.map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="font-mono text-[12px] uppercase tracking-[0.14em] text-slate-500 sm:pt-1">{k}</dt>
                      <dd className="text-slate-200">{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">What we sell, and to whom</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    <strong className="text-slate-100">To agents, per call.</strong> Data, verification,
                    media and market-intelligence endpoints priced from $0.005. An agent reads the price in
                    an HTTP 402 response, signs a USDC transfer, and gets the answer. Listed in the Bazaar,
                    x402-list and the MCP Registry so agents find them without us in the room.{' '}
                    <a href="/tools" className="text-blue-400 hover:text-blue-300">Catalog</a>.
                  </li>
                  <li>
                    <strong className="text-slate-100">To builders, one time.</strong> The{' '}
                    <a href="/checklist" className="text-blue-400 hover:text-blue-300">x402 Starter Kit</a>{' '}
                    (free checklist, $49 build kit, $149 distribution playbook) and the{' '}
                    <a href="/kronos/field-guide" className="text-blue-400 hover:text-blue-300">Kronos Field Guide</a>{' '}
                    (ebook plus a coding-agent build package).
                  </li>
                  <li>
                    <strong className="text-slate-100">To anyone, free.</strong> A{' '}
                    <a href="/vin" className="text-blue-400 hover:text-blue-300">VIN checker</a>, a{' '}
                    <a href="/trades" className="text-blue-400 hover:text-blue-300">trades price tracker</a>, the{' '}
                    <a href="/payment-rules" className="text-blue-400 hover:text-blue-300">payment-rules watch</a>, a weekly{' '}
                    <a href="/brief" className="text-blue-400 hover:text-blue-300">brief</a>, and the{' '}
                    <a href="/blog" className="text-blue-400 hover:text-blue-300">blog</a> where we publish what we measure.
                  </li>
                  <li>
                    <strong className="text-slate-100">Physical, machine-buyable.</strong>{' '}
                    <a href="https://x402swag.com" className="text-blue-400 hover:text-blue-300">x402swag.com</a> sells
                    merch and framed prints to agents and humans through the same payment rail, including a
                    bring-your-own-design print studio.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">How one person runs nineteen services</h2>
                <p className="mt-3">
                  Everything is self-serve and automated by design: payments settle on-chain without a
                  human, listings keep themselves alive, health checks run every morning, and support is
                  replaced by clear terms, previews you approve before you pay, and a printer&rsquo;s reprint
                  guarantee. That discipline is the product. It is also why the company can be run around a
                  day job and why every dollar of outside money goes to distribution and durability, not
                  headcount.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">Milestones</h2>
                <ol className="mt-4 space-y-3 border-l border-white/[0.08] pl-5">
                  {MILESTONES.map(([when, what]) => (
                    <li key={when + what}>
                      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-300/80">{when}</div>
                      <div className="text-slate-300">{what}</div>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">Why this matters</h2>
                <p className="mt-3">
                  Agents are becoming buyers. The x402 standard moved to the Linux Foundation in April 2026,
                  the marketplaces we index passed 14,000 listed resources, and our own{' '}
                  <a href="/blog/x402-bazaar-health-census-august-2026" className="text-blue-400 hover:text-blue-300">
                    August census
                  </a>{' '}
                  found a quarter of them dead or leaking paid content for free. The opportunity is not
                  another marketplace. It is being the operator whose services are healthy, verified, and
                  documented everywhere an agent looks, and then teaching other builders to do the same.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">Press, partners, grants</h2>
                <p className="mt-3">
                  Everything on this page is verifiable from public surfaces: the{' '}
                  <a href="/tools" className="text-blue-400 hover:text-blue-300">catalog</a>, the{' '}
                  <a href="https://x402-list.com/services/operator/forgemesh" className="text-blue-400 hover:text-blue-300">
                    x402-list operator hub
                  </a>
                  , the{' '}
                  <a href="https://github.com/forgemeshlabs" className="text-blue-400 hover:text-blue-300">GitHub org</a>, and
                  Base mainnet itself. Write to{' '}
                  <a href="mailto:hello@forgemesh.io" className="text-blue-400 hover:text-blue-300">hello@forgemesh.io</a>.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
