import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Terms of Service & Disclaimer | ForgeMesh Labs',
  description:
    'Terms for using forgemesh.io, ForgeMesh x402 API services, open-source MCP servers and AI Skills — including the legal disclaimer for advertising, scoring and agent-automation tools.',
  alternates: { canonical: '/terms' },
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
                Terms &amp; disclaimer · updated {UPDATED}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-slate-50 sm:text-5xl">
              Terms of Service &amp; Disclaimer
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-400">
              These terms apply to forgemesh.io and its subdomains, our x402-paid API services, and the
              open-source MCP servers and AI Skills published by ForgeMesh Labs (together, the
              &ldquo;Services&rdquo;). By using the Services you agree to them. Our{' '}
              <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a> explains what we collect.
            </p>

            <div className="mt-12 space-y-10 text-[15px] leading-7 text-slate-300">
              <section id="disclaimer">
                <h2 className="text-xl font-semibold text-slate-50">1. Disclaimer</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    <strong className="text-slate-100">As is.</strong> The Services are provided &ldquo;as is&rdquo;
                    and &ldquo;as available&rdquo;, without warranty of any kind, express or implied, including
                    merchantability, fitness for a particular purpose, accuracy and non-infringement.
                  </li>
                  <li>
                    <strong className="text-slate-100">Scores and audits are opinions, not guarantees.</strong>{' '}
                    ASO / agent-readiness scores, SEO authority scores, landing-page health states, endpoint
                    audits and similar outputs are heuristic, experimental and will change as standards evolve.
                    They do not guarantee rankings, conversions, ad performance, agent behaviour or compliance
                    with any platform&rsquo;s policies.
                  </li>
                  <li>
                    <strong className="text-slate-100">AI Skills act through your agent.</strong> Our AI Skills
                    are instruction files that run inside your own AI agent, using your own credentials and
                    connections (for example TikTok for Business MCP Server). You are responsible for every
                    action your agent takes, including any change to campaigns, ads, budgets or audiences.
                    Skills that can write are designed to ask for confirmation first; review each proposed
                    change before you approve it.
                  </li>
                  <li>
                    <strong className="text-slate-100">Third-party platforms.</strong> ForgeMesh Labs is not
                    affiliated with, endorsed by or acting on behalf of TikTok, ByteDance, Coinbase, Stripe,
                    Google, Meta or any other platform referenced in the Services. Use of those platforms is
                    governed by their own terms and policies, which you must follow.
                  </li>
                  <li>
                    <strong className="text-slate-100">Not professional advice.</strong> Nothing in the Services
                    is legal, financial, investment, tax or advertising-compliance advice.
                  </li>
                  <li>
                    <strong className="text-slate-100">Crypto payments.</strong> x402 payments settle in USDC on
                    public blockchains and are irreversible. You are responsible for your wallet, keys and any
                    spending limits you configure. Prices are shown per call before payment via the HTTP 402 challenge.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">2. Acceptable use</h2>
                <p className="mt-3">
                  Do not use the Services to scan, probe or act on systems you do not own or have permission
                  to test; to violate any law or third-party right; to send spam; to circumvent rate limits or
                  payment; or to attack, overload or reverse-engineer our infrastructure. We may suspend access
                  for abuse without notice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">3. Open-source software</h2>
                <p className="mt-3">
                  MCP servers and Skills published under <code className="font-mono text-slate-200">@forgemeshlabs</code> and
                  on GitHub are licensed under the licence in each repository (MIT unless stated otherwise).
                  That licence governs the code; these terms govern the hosted Services and marketplace listings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">4. Paid services</h2>
                <p className="mt-3">
                  Paid API calls are one-time, pay-per-request purchases settled via x402. A settled payment
                  buys one response to that request. There are no subscriptions unless explicitly stated on the
                  product page. If a paid request fails on our side after settlement, email us with the
                  transaction hash and we will re-run it or refund it at our discretion.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">5. Limitation of liability</h2>
                <p className="mt-3">
                  To the fullest extent permitted by law, ForgeMesh Labs and its operators are not liable for
                  any indirect, incidental, special, consequential or punitive damages, or for lost profits,
                  revenue, data, ad spend or goodwill, arising from the Services. Our total liability for any
                  claim is limited to the amount you paid us for the specific request giving rise to the claim
                  in the 30 days before it, or USD 100, whichever is greater.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">6. Indemnity</h2>
                <p className="mt-3">
                  You will indemnify ForgeMesh Labs against claims arising from your use of the Services, your
                  agent&rsquo;s actions, or your breach of these terms or any third-party platform policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">7. Changes and termination</h2>
                <p className="mt-3">
                  We may change or discontinue any part of the Services at any time. We will update the date at
                  the top of this page when these terms change; continued use after a change is acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">8. Governing law</h2>
                <p className="mt-3">
                  These terms are governed by the laws of the State of Texas, USA, without regard to conflict-of-law
                  rules. Disputes are resolved in the state or federal courts located in Texas, and you consent to
                  their jurisdiction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">9. Contact</h2>
                <p className="mt-3">
                  ForgeMesh Labs · <a href="mailto:hello@forgemesh.io" className="text-blue-400 hover:text-blue-300">hello@forgemesh.io</a> ·{' '}
                  <a href="https://forgemesh.io" className="text-blue-400 hover:text-blue-300">forgemesh.io</a>
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
