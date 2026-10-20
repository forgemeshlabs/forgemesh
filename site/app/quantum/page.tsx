// Free quantum-readiness check for humans — the funnel mouth for the paid
// Utility Grid route (x402.forgemesh.io/quantum-readiness, $0.05, for agents).
// Plumbing: lib/quantum-check.ts → /api/quantum-check (live TLS probes from
// this server, rate-limited, 10-minute cache). Never touches a paid endpoint.
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { QuantumChecker } from '@/components/QuantumChecker';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Post-Quantum TLS Check | ForgeMesh',
  description:
    'Check a hostname for ML-KEM hybrid TLS support, certificate trust, HSTS and CAA. Free browser check or structured JSON for agents at $0.05 per call.',
  keywords: ['quantum readiness check', 'post-quantum tls test', 'pqc checker', 'ml-kem check', 'x25519mlkem768', 'harvest now decrypt later', 'is my site quantum safe', 'fips 203', 'post quantum cryptography readiness'],
  alternates: { canonical: '/quantum' },
  openGraph: { title: 'Quantum Readiness Check: is your site post-quantum yet?', description: 'Test hybrid post-quantum TLS support and transport hygiene. One hostname, structured findings, practical next steps. Free, no signup.', type: 'website', url: 'https://forgemesh.io/quantum' },
  twitter: { card: 'summary_large_image', title: 'Quantum Readiness Check', description: 'Does your site already negotiate post-quantum TLS? Score, verdict, fixes. Free.' },
};

const faq = [
  { q: 'What does this check measure?', a: 'It tests whether one resolved HTTPS address accepts X25519MLKEM768, a hybrid of classical X25519 and post-quantum ML-KEM, plus pure ML-KEM and classical handshakes. A successful probe establishes support on that connection. It does not prove every visitor uses it.' },
  { q: 'What is harvest-now-decrypt-later?', a: 'An attacker can record encrypted traffic now and try to decrypt it with a future cryptographically relevant quantum computer. Hybrid key exchange is designed to address that risk for sessions that negotiate it. The report cannot observe what other clients negotiated.' },
  { q: 'Does TLS 1.3 mean post-quantum?', a: 'No. TLS 1.3 also supports classical key exchange. The group actually negotiated matters. TLS 1.2 acceptance is reported separately; it is not proof that an attacker can force a modern client to downgrade.' },
  { q: 'Does this test the origin behind my CDN?', a: 'It tests the address reached for the hostname you enter, usually the CDN edge. The edge-to-origin connection is separate and is not assessed by this result.' },
  { q: 'How do I enable hybrid key exchange?', a: 'Check your CDN or TLS library documentation for X25519MLKEM768 support. OpenSSL 3.5 includes it in its default group list. For nginx built against a supporting OpenSSL version, configure ssl_ecdh_curve X25519MLKEM768:X25519:prime256v1; and verify the result after reloading.' },
  { q: 'What does the score mean?', a: 'It is a ForgeMesh heuristic out of 90, combining tested key-exchange support and transport hygiene. Ten additional points are reserved but not awarded because certificate signatures are not assessed. This is not a compliance rating, certification or percentage of security.' },
  { q: 'Can an agent use it?', a: 'POST https://x402.forgemesh.io/quantum-readiness with {"domain":"example.com"}. The Utility Grid route costs $0.05 per call and returns structured findings, per-check points and remediation. An unpaid request returns the payment challenge.' },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebApplication', name: 'ForgeMesh Quantum Readiness Check', url: 'https://forgemesh.io/quantum', applicationCategory: 'SecurityApplication', operatingSystem: 'Web', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Free post-quantum TLS readiness check: ML-KEM hybrid key exchange, TLS 1.2 acceptance, HSTS, certificate validity and CAA, scored with a harvest-now-decrypt-later verdict and fixes.',
      featureList: ['X25519MLKEM768 negotiation test', 'Pure ML-KEM-768 test', 'TLS 1.2 acceptance test', 'HSTS and CAA checks', 'Certificate validity and trust', 'Per-server remediation steps'],
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' } },
    { '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ],
};

export default function QuantumPage() {
  return (
    <>
      <NavBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-4 pb-14 pt-28 sm:px-6 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.18),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(16,185,129,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Quantum readiness · free · no signup</span>
            </div>
            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">Is your site post-quantum yet?</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              Check whether your HTTPS endpoint accepts hybrid post-quantum key exchange. Four live TLS probes return a score out of 90, findings and practical next steps.
            </p>
            <QuantumChecker />
          </div>
        </section>
        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">What is checked</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ['Post-quantum key exchange', 'A handshake offering only X25519MLKEM768 (FIPS 203 ML-KEM in a hybrid with X25519). Success confirms hybrid support for this probe, not every visitor connection. 50 of 90 points.'],
                ['Classical compatibility', 'A handshake offering only TLS 1.2. Acceptance means classical connections are possible. A timeout is inconclusive; TLS 1.3 can also use classical groups.'],
                ['Transport hygiene', 'HSTS strength, certificate validity and trust chain, CAA records. Supporting transport checks, separate from post-quantum key exchange.'],
                ['Agent economy angle', 'If the host publishes an x402 manifest, the report records its presence. Payment-header protection still depends on each client connection.'],
              ].map(([h, p]) => (
                <div key={h} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-medium text-slate-100">{h}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">FAQ</h2>
            <dl className="mt-6 space-y-7">
              {faq.map((f) => (
                <div key={f.q}><dt className="font-medium text-slate-100">{f.q}</dt><dd className="mt-2 text-sm leading-7 text-slate-400">{f.a}</dd></div>
              ))}
            </dl>
            <p className="mt-8 text-sm leading-7 text-slate-400">
              How ForgeMesh itself is set up is on the <a href="/security" className="text-blue-400 hover:text-blue-300">security page</a>: our edge supports ML-KEM hybrid; each client must negotiate it.
            </p>
          </div>
        </section>
        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-blue-500/25 bg-blue-500/[0.06] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Developers and agents</p>
              <p className="mt-3 text-base leading-7 text-slate-300">
                The same probe as an API: POST x402.forgemesh.io/quantum-readiness with a domain, $0.05 per call in USDC over x402 or MPP, no account or API key. Full findings, per-check points and remediation as JSON, for readiness audits and fleet sweeps.
              </p>
              <a href="https://x402.forgemesh.io/quantum-readiness" className="mt-4 inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20">
                Utility Grid route <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <p className="mt-8 text-xs leading-6 text-slate-500">
              This check reads TLS handshake parameters and public headers only. It does not test certificate chains for revocation, scan ports, or make any claim about payments or wallets being quantum-safe. The result covers one resolved address at one moment. It does not assess other clients, other PQ groups, stored data, origin connections or compliance. Re-check after server or CDN changes.
            </p>
          </div>
        </section>
        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
