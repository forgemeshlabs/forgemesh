import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Privacy Policy | ForgeMesh Labs',
  description:
    'What ForgeMesh Labs collects on forgemesh.io, in The Brief newsletter, in our MCP servers and AI Skills, and through x402-paid services — and what we do not.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

const UPDATED = '2026-08-28';

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
                Privacy policy · updated {UPDATED}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-slate-50 sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-400">
              This policy covers forgemesh.io and its subdomains, The Brief newsletter, the open-source
              MCP servers and AI Skills published by ForgeMesh Labs, and our x402-paid API services
              (&ldquo;Services&rdquo;). It is written to be read, not skimmed past. Questions:{' '}
              <a href="mailto:hello@forgemesh.io" className="text-blue-400 hover:text-blue-300">hello@forgemesh.io</a>.
            </p>

            <div className="mt-12 space-y-10 text-[15px] leading-7 text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-slate-50">1. What we collect</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    <strong className="text-slate-100">Website analytics.</strong> forgemesh.io uses
                    self-hosted, first-party Umami analytics. It is cookie-less, does not fingerprint
                    devices, and records page views, referrers, country, browser and device class. You can
                    exclude your browser at <a href="/no-track" className="text-blue-400 hover:text-blue-300">/no-track</a>.
                  </li>
                  <li>
                    <strong className="text-slate-100">Newsletter.</strong> If you subscribe to The
                    Brief we store your email address and the date you subscribed. Mail is sent through
                    Amazon SES. Every issue carries an unsubscribe link; unsubscribing removes you from the list.
                  </li>
                  <li>
                    <strong className="text-slate-100">Contact.</strong> Email you send to us is kept for
                    as long as needed to answer it and keep a record of the conversation.
                  </li>
                  <li>
                    <strong className="text-slate-100">Paid API calls (x402).</strong> Our paid endpoints
                    settle in USDC on public blockchains (Base, Solana). A payment leaves a public,
                    permanent on-chain record: paying wallet address, amount, timestamp, and our receiving
                    address. We log the request path, timestamp, response status and the paying address
                    for accounting, abuse prevention and service analytics. We do not link wallet
                    addresses to names or emails unless you give us both.
                  </li>
                  <li>
                    <strong className="text-slate-100">Service inputs.</strong> Requests you send to our
                    APIs (for example a URL to scan or a query to expand) are processed to produce the
                    response and are retained in short-lived logs for debugging, then discarded.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">2. MCP servers and AI Skills</h2>
                <p className="mt-3">
                  Our open-source MCP servers (published under <code className="font-mono text-slate-200">@forgemeshlabs</code> on npm)
                  run on your machine inside your own agent. Free scanners such as the Agent Readiness
                  scanner make ordinary HTTP requests from your machine to the sites you ask them to check;
                  nothing is sent to ForgeMesh. Servers that call a paid ForgeMesh API do so only when you
                  invoke a paid tool, and only with the inputs for that call.
                </p>
                <p className="mt-3">
                  Our AI Skills (including those listed on third-party marketplaces such as the TikTok for
                  Business Agentic Hub) are instruction files. They contain no code that contacts ForgeMesh.
                  Data your agent reads from a third-party platform (for example ad, campaign or spend data
                  from TikTok for Business MCP Server) stays inside your agent session and is never
                  transmitted to us. Skills that can perform write actions require your explicit confirmation
                  in chat before each change.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">3. What we do not do</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>We do not sell, rent or trade personal data.</li>
                  <li>We do not run third-party advertising trackers or ad pixels on forgemesh.io.</li>
                  <li>We do not use your newsletter address for anything other than The Brief and direct replies.</li>
                  <li>We do not train models on your API inputs.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">4. Processors we rely on</h2>
                <p className="mt-3">
                  Cloudflare (DNS, CDN, DDoS protection), Amazon Web Services (hosting, SES email), Vercel
                  (some static properties), GitHub and npm (source and package distribution), Umami
                  (self-hosted analytics on our own infrastructure), and public blockchain networks and
                  x402 facilitators for settlement. Each processes data only as needed to provide its function.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">5. Retention</h2>
                <p className="mt-3">
                  Analytics are kept in aggregate indefinitely. Request logs are rotated within 90 days.
                  Newsletter addresses are kept until you unsubscribe. On-chain records are permanent by
                  design and outside our control.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">6. Your rights</h2>
                <p className="mt-3">
                  You can ask what we hold about you, ask us to correct or delete it, or object to processing,
                  by emailing <a href="mailto:hello@forgemesh.io" className="text-blue-400 hover:text-blue-300">hello@forgemesh.io</a>.
                  We answer within 30 days. Residents of the EU/EEA, UK, California and other jurisdictions
                  with data-protection laws have the rights those laws provide; we honour them regardless of
                  where you live.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">7. Children</h2>
                <p className="mt-3">The Services are not directed to anyone under 16 and we do not knowingly collect their data.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">8. Changes</h2>
                <p className="mt-3">
                  We will update the date at the top of this page when the policy changes. Material changes
                  are announced in The Brief.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">9. Contact</h2>
                <p className="mt-3">
                  ForgeMesh Labs · <a href="mailto:hello@forgemesh.io" className="text-blue-400 hover:text-blue-300">hello@forgemesh.io</a> ·{' '}
                  <a href="https://forgemesh.io" className="text-blue-400 hover:text-blue-300">forgemesh.io</a>.
                  See also our <a href="/terms" className="text-blue-400 hover:text-blue-300">Terms &amp; Disclaimer</a>.
                </p>
              </section>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
