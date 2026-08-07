import type { Metadata } from 'next';
import {
  Activity,
  ArrowUpRight,
  CircleDollarSign,
  ShieldCheck,
  Terminal,
  Waypoints,
} from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';

export const metadata: Metadata = {
  title: 'Kronos by ForgeMesh — Auditable Market Intelligence for AI Agents',
  description:
    'Eight MCP tools for calibrated crypto price ranges, signal and risk context, decision journals, whale flows, and outcome audits. Pay per call through x402 on Base.',
  alternates: { canonical: 'https://forgemesh.io/kronos' },
};

const tools = [
  ['get_kronos_risk', 'Risk state, streaks, and cooldown context', '$0.02'],
  ['get_kronos_whale_flows', 'Whale, exchange, bridge, and stablecoin flows', '$0.02'],
  ['get_kronos_signals', 'Current multi-symbol signal context', '$0.05'],
  ['get_kronos_history', 'Up to 168 hours of signal history', '$0.05'],
  ['get_kronos_forecast', 'Calibrated 80% range and upside probability', '$0.05'],
  ['check_kronos_preflight', 'Conditions check before journaling', '$0.05'],
  ['audit_kronos_decision', 'Outcome audit for a prior decision_id', '$0.07'],
  ['create_kronos_decision', 'Auditable market-intelligence journal', '$0.15'],
] as const;

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kronos by ForgeMesh',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any MCP-compatible client',
  url: 'https://forgemesh.io/kronos',
  downloadUrl: 'https://www.npmjs.com/package/kronos-forgemesh-mcp',
  codeRepository: 'https://github.com/forgemeshlabs/kronos-forgemesh-mcp',
  description:
    'MCP server for auditable crypto market intelligence with automatic x402 USDC payments on Base.',
  offers: { '@type': 'AggregateOffer', lowPrice: '0.02', highPrice: '0.15', priceCurrency: 'USDC' },
};

function InstallPanel() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.09] bg-[#080810]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">Install over stdio</span>
        <Terminal className="h-4 w-4 text-blue-300" strokeWidth={1.6} aria-hidden="true" />
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-200"><code>npx -y kronos-forgemesh-mcp</code></pre>
      <p className="border-t border-white/[0.07] px-5 py-4 text-xs leading-6 text-slate-500">
        Set <span className="font-mono text-slate-300">WALLET_PRIVATE_KEY</span> to a dedicated low-balance Base wallet.
        Listing tools is free; payment occurs only when a tool is invoked.
      </p>
    </div>
  );
}

export default function KronosPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#050509] text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
        />

        <section className="px-6 pb-20 pt-28 sm:pt-36">
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="mb-8 inline-flex items-center gap-3 border-y border-white/[0.09] py-3">
                <ForgeMeshMark size={24} className="shrink-0" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                  Market intelligence · MCP + x402
                </span>
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-6xl">
                Keep the forecast. Audit the record.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                Kronos gives agents calibrated ranges, current signal and risk context, decision journals, and the
                outcome audit that closes the loop. Eight tools. No subscription. Pay only for the call you make.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.npmjs.com/package/kronos-forgemesh-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-blue-100 active:translate-y-px"
                >
                  Open npm <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="https://github.com/forgemeshlabs/kronos-forgemesh-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-400/40 active:translate-y-px"
                >
                  Read the source
                </a>
              </div>
            </div>
            <InstallPanel />
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-[#080810] px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: ShieldCheck, title: 'Quote before charge', text: 'The endpoint returns an x402 price challenge before the MCP signs anything.' },
                { icon: Waypoints, title: 'One intelligence origin', text: 'Every tool is restricted to the dedicated Kronos by ForgeMesh API origin.' },
                { icon: CircleDollarSign, title: 'USDC on Base', text: 'Calls cost $0.02-$0.15 and settle through the x402 payment flow.' },
              ].map(({ icon: Icon, title, text }) => (
                <article key={title} className="border-t border-white/[0.1] pt-6">
                  <Icon className="mb-5 h-5 w-5 text-blue-300" strokeWidth={1.6} aria-hidden="true" />
                  <h2 className="text-base font-medium text-slate-100">{title}</h2>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-blue-300/70">Tool ledger</p>
              <h2 className="text-3xl font-medium tracking-tight text-slate-100 sm:text-4xl">Eight calls. Clear prices.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
                Start with risk or signals. Use preflight before a decision journal. Return later with the decision_id
                to audit what actually happened.
              </p>
            </div>
            <div className="divide-y divide-white/[0.07] border-y border-white/[0.09]">
              {tools.map(([name, purpose, price]) => (
                <div key={name} className="grid gap-2 py-4 sm:grid-cols-[1.2fr_1.6fr_auto] sm:items-center sm:gap-6">
                  <code className="text-xs text-blue-200">{name}</code>
                  <span className="text-sm text-slate-500">{purpose}</span>
                  <span className="font-mono text-xs text-slate-300">{price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#080810] px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-blue-300/70">The audit loop</p>
              <h2 className="text-3xl font-medium tracking-tight text-slate-100 sm:text-4xl">
                A decision is only useful if it leaves evidence.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500">
                Kronos is market intelligence, not an instruction to transact. The product centers the record:
                inspect conditions, create a timestamped journal, then compare it with later prices.
              </p>
            </div>
            <ol className="space-y-0 border-y border-white/[0.09]">
              {[
                ['01', 'Preflight', 'Check risk state, cooldowns, freshness, and warnings.'],
                ['02', 'Decision journal', 'Receive calibrated context and a decision_id.'],
                ['03', 'Outcome audit', 'Evaluate the prior record after 1h, 4h, or 24h.'],
              ].map(([number, title, text]) => (
                <li key={number} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/[0.07] py-5 last:border-b-0">
                  <span className="font-mono text-xs text-blue-300/70">{number}</span>
                  <div>
                    <h3 className="text-base font-medium text-slate-100">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 border-t border-white/[0.1] pt-10 md:flex-row md:items-end">
            <div>
              <Activity className="mb-5 h-6 w-6 text-blue-300" strokeWidth={1.6} aria-hidden="true" />
              <h2 className="text-2xl font-medium text-slate-100">The API is live.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">OpenAPI, x402 discovery, and direct REST access are available at the product origin.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="https://kronos.forgemesh.io" className="text-blue-300 hover:text-blue-200">API origin ↗</a>
              <a href="https://kronos.forgemesh.io/openapi.json" className="text-slate-400 hover:text-slate-200">OpenAPI ↗</a>
              <a href="https://kronos.forgemesh.io/.well-known/x402.json" className="text-slate-400 hover:text-slate-200">x402 discovery ↗</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
