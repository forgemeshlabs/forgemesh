import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import { Hero } from '@/components/Hero';
import { Architecture } from '@/components/Architecture';
import { Projects } from '@/components/Projects';
import { Philosophy } from '@/components/Philosophy';
import { Discovery } from '@/components/Discovery';
import { Footer } from '@/components/Footer';
import { FLEET } from '@/lib/mesh';
import './home.css';

export const metadata: Metadata = {
  title: 'ForgeMesh Labs — Paid APIs for AI Agents · x402 on Base',
  description:
    'Live x402 services for AI agents: notarization, anomaly detection, disruption intel, travel, voice, market signals, image generation. USDC per call on Base, from $0.001. No accounts, no API keys.',
};

const MCP_ROWS: { pkg: string; href: string; wraps: string; install: string }[] = [
  {
    pkg: 'kronos-forgemesh-mcp',
    href: 'https://www.npmjs.com/package/kronos-forgemesh-mcp',
    wraps: 'Kronos market intelligence',
    install: 'npx -y kronos-forgemesh-mcp',
  },
  {
    pkg: '@forgemeshlabs/x402-notary-mcp',
    href: 'https://www.npmjs.com/package/@forgemeshlabs/x402-notary-mcp',
    wraps: 'Notary',
    install: 'npx -y @forgemeshlabs/x402-notary-mcp',
  },
  {
    pkg: '@forgemeshlabs/anomaly-mcp',
    href: 'https://www.npmjs.com/package/@forgemeshlabs/anomaly-mcp',
    wraps: 'Anomaly Tracker',
    install: 'npx -y @forgemeshlabs/anomaly-mcp',
  },
  {
    pkg: '@forgemeshlabs/disruption-intelligence-mcp',
    href: 'https://www.npmjs.com/package/@forgemeshlabs/disruption-intelligence-mcp',
    wraps: 'Disruption Intel',
    install: 'npx -y @forgemeshlabs/disruption-intelligence-mcp',
  },
  {
    pkg: '@forgemeshlabs/travel-agent-mcp',
    href: 'https://www.npmjs.com/package/@forgemeshlabs/travel-agent-mcp',
    wraps: 'Travel Agent',
    install: 'npx -y @forgemeshlabs/travel-agent-mcp',
  },
  {
    pkg: 'coinopai-mcp',
    href: 'https://www.npmjs.com/package/coinopai-mcp',
    wraps: 'CoinOpAI x402',
    install: 'npx -y coinopai-mcp',
  },
  {
    pkg: 'forgemesh-imagegen',
    href: 'https://www.npmjs.com/package/forgemesh-imagegen',
    wraps: 'ImageGen',
    install: 'npx -y forgemesh-imagegen',
  },
  {
    pkg: 'affiliate-router-mcp',
    href: 'https://www.npmjs.com/package/affiliate-router-mcp',
    wraps: 'Affiliate routing — 8 tools',
    install: 'npx -y affiliate-router-mcp',
  },
  {
    pkg: '@forgemeshlabs/aso-audit-mcp',
    href: 'https://agentsignaloptimization.com',
    wraps: 'ASO toolkit — audit, score, readiness',
    install: 'npx -y @forgemeshlabs/aso-audit-mcp',
  },
];

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ForgeMesh Labs',
    url: 'https://forgemesh.io',
    sameAs: ['https://x.com/forgemeshlabs', 'https://github.com/forgemeshlabs'],
    description:
      'ForgeMesh Labs runs paid x402 APIs and MCP servers for AI agents — USDC micropayments on Base, no accounts, no API keys.',
    makesOffer: FLEET.map((s) => ({
      '@type': 'Offer',
      name: s.name,
      description: s.tagline,
      url: `https://${s.domain}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <NavBar />
      <main id="main-content">
        <Hero />

        <div className="fm-root">
          <section className="fm-sec" id="x402">
            <div className="wrap">
              <p className="fm-eyebrow">How it pays</p>
              <h2>One HTTP round-trip. No invoices.</h2>
              <p className="fm-lede">
                x402 turns HTTP&rsquo;s 402 status code into a payment rail. Four steps, in order —
                your agent does all of them in one retry.
              </p>
              <div className="fm-flow">
                <div className="fm-step">
                  <span className="n">01 · CALL</span>
                  <h3>Request anything</h3>
                  <p>Your agent calls a paid endpoint like any API. No key, no signup.</p>
                  <code>POST /api/notarize</code>
                </div>
                <div className="fm-step">
                  <span className="n">02 · 402</span>
                  <h3>Price quoted</h3>
                  <p>The service answers 402 Payment Required with the price and pay-to address.</p>
                  <code>{'{"maxAmountRequired": "$0.001"}'}</code>
                </div>
                <div className="fm-step">
                  <span className="n">03 · SIGN</span>
                  <h3>Authorize USDC</h3>
                  <p>
                    The agent signs a USDC transfer authorization and retries. One header. No gas.
                  </p>
                  <code>X-PAYMENT: eyJ…</code>
                </div>
                <div className="fm-step">
                  <span className="n">04 · SETTLE</span>
                  <h3>Paid + answered</h3>
                  <p>Settlement lands on Base in seconds. The result arrives in the same response.</p>
                  <code>200 OK · tx 0x…</code>
                </div>
              </div>
            </div>
          </section>

          <section className="fm-sec" id="mcp">
            <div className="wrap">
              <p className="fm-eyebrow">MCP servers</p>
              <h2>Plug the mesh into your agent.</h2>
              <p className="fm-lede">
                Every major service ships as an MCP package on npm. Free tools work with no wallet;
                paid tools quote first, then charge USDC.
              </p>
              <div className="fm-ledger">
                <table>
                  <thead>
                    <tr>
                      <th>Package</th>
                      <th>Wraps</th>
                      <th>Install</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MCP_ROWS.map((r) => (
                      <tr key={r.pkg}>
                        <td className="pkg">
                          <a href={r.href}>{r.pkg}</a>
                        </td>
                        <td className="what">{r.wraps}</td>
                        <td className="install">{r.install}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <Projects />
        <Architecture />
        <Philosophy />
        <Discovery />
      </main>
      <Footer />
    </>
  );
}
