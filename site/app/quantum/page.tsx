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
  title: 'Quantum Readiness Check: Is Your Site Post-Quantum Yet? | ForgeMesh',
  description:
    'Free post-quantum TLS check. Enter any hostname: does it negotiate X25519MLKEM768, is TLS 1.2 downgrade still open, HSTS, certificate and CAA. Scored 0-100 with a harvest-now-decrypt-later verdict and the exact server settings to fix it.',
  keywords: ['quantum readiness check', 'post-quantum tls test', 'pqc checker', 'ml-kem check', 'x25519mlkem768', 'harvest now decrypt later', 'is my site quantum safe', 'fips 203', 'post quantum cryptography migration'],
  alternates: { canonical: '/quantum' },
  openGraph: { title: 'Quantum Readiness Check: is your site post-quantum yet?', description: 'Four live TLS handshakes tell you whether sessions recorded today could be decrypted by a future quantum computer, and what to change. Free, no signup.', type: 'website', url: 'https://forgemesh.io/quantum' },
  twitter: { card: 'summary_large_image', title: 'Quantum Readiness Check', description: 'Does your site already negotiate post-quantum TLS? Score, verdict, fixes. Free.' },
};

const faq = [
  { q: 'What does "quantum ready" mean for a website?', a: 'That the TLS key exchange already includes a post-quantum algorithm. The standard one is ML-KEM (FIPS 203), deployed as the hybrid group X25519MLKEM768: a classical X25519 exchange and an ML-KEM exchange combined, so the session is safe unless both are broken. Browsers have offered it since 2024 and most CDN edges accept it by default.' },
  { q: 'What is harvest-now-decrypt-later, and why is key exchange the part that matters?', a: 'An adversary can record encrypted traffic today and decrypt it once a large enough quantum computer exists. That only works if the key exchange was classical, because the session keys were agreed with math a quantum computer can reverse. The certificate signature also uses classical math, but a future forgery cannot reach back into a session recorded today, which is why the industry fixed key exchange first and certificates later.' },
  { q: 'My site runs behind Cloudflare, Fastly or Vercel. Am I done?', a: 'For the leg between visitors and the edge, usually yes: those edges negotiate X25519MLKEM768 by default, and this check will show it. The leg from the edge to your origin is a separate connection; check the origin hostname too if it is reachable, and enable post-quantum on the tunnel or origin TLS where your provider offers it.' },
  { q: 'How do I enable post-quantum key exchange on my own server?', a: 'nginx: OpenSSL 3.5 or newer and ssl_ecdh_curve X25519MLKEM768:X25519:prime256v1. Caddy: Go 1.24 or newer, on by default. Node: version 24 or newer with OpenSSL 3.5. HAProxy 3.1 or newer via the curves list. Apache: build against OpenSSL 3.5 and set SSLOpenSSLConfCmd Groups X25519MLKEM768:X25519. Then re-run this check.' },
  { q: 'Why is the maximum score 90 today?', a: 'Ten points are reserved for post-quantum certificate signatures (ML-DSA, FIPS 204). No public certificate authority issues them yet, so no site can earn those points in 2026. When they ship, the check will start awarding them.' },
  { q: 'What are the official deadlines?', a: 'NIST IR 8547 deprecates 112-bit classical public-key cryptography by 2030 and disallows it by 2035. The U.S. CNSA 2.0 suite expects web services to prefer post-quantum algorithms by 2025 and use them exclusively by 2033. Several regulators and payment schemes are tracking the same dates.' },
  { q: 'Can my software or AI agent run this check?', a: 'Yes. The same probe is a pay-per-call route on the ForgeMesh Utility Grid: POST x402.forgemesh.io/quantum-readiness with {"domain": "example.com"}, $0.05 in USDC over x402 or MPP, no account or API key. It returns the full findings block, the per-check points and the recommendations as JSON, and flags x402 sellers whose payment headers still travel over classical-only crypto.' },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebApplication', name: 'ForgeMesh Quantum Readiness Check', url: 'https://forgemesh.io/quantum', applicationCategory: 'SecurityApplication', operatingSystem: 'Web', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Free post-quantum TLS readiness check: ML-KEM hybrid key exchange, TLS 1.2 downgrade, HSTS, certificate validity and CAA, scored with a harvest-now-decrypt-later verdict and fixes.',
      featureList: ['X25519MLKEM768 negotiation test', 'Pure ML-KEM-768 test', 'TLS 1.2 downgrade test', 'HSTS and CAA checks', 'Certificate validity and signature family', 'Per-server remediation steps'],
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
              Four live TLS handshakes answer the question that matters: could traffic recorded from this host today be decrypted by a future quantum computer? You get a score, a plain verdict, and the exact server setting to change.
            </p>
            <QuantumChecker />
          </div>
        </section>
        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">What is checked</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ['Post-quantum key exchange', 'A handshake offering only X25519MLKEM768 (FIPS 203 ML-KEM in a hybrid with X25519). If it completes, recorded sessions are safe from a future quantum computer. 50 of 90 points.'],
                ['Downgrade surface', 'A handshake offering only TLS 1.2. If the server accepts it, a downgraded client still gets a classical-only session worth recording.'],
                ['Transport hygiene', 'HSTS strength, certificate validity and trust chain, CAA records. The parts that keep the post-quantum handshake from being bypassed.'],
                ['Agent economy angle', 'If the host publishes an x402 manifest, the report says whether its payment headers travel inside a post-quantum handshake.'],
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
              How ForgeMesh itself is set up is on the <a href="/security" className="text-blue-400 hover:text-blue-300">security page</a>: every host negotiates ML-KEM hybrid at the edge, and 402 handshakes ride inside it.
            </p>
          </div>
        </section>
        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-blue-500/25 bg-blue-500/[0.06] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Developers and agents</p>
              <p className="mt-3 text-base leading-7 text-slate-300">
                The same probe as an API: POST x402.forgemesh.io/quantum-readiness with a domain, $0.05 per call in USDC over x402 or MPP, no account or API key. Full findings, per-check points and remediation as JSON, for migration audits and fleet sweeps.
              </p>
              <a href="https://x402.forgemesh.io/quantum-readiness" className="mt-4 inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20">
                Utility Grid route <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <p className="mt-8 text-xs leading-6 text-slate-500">
              This check reads TLS handshake parameters and public headers only. It does not test certificate chains for revocation, scan ports, or make any claim about payments or wallets being quantum-safe. A passing score means the key exchange on this hostname is post-quantum today; keep re-checking after server or CDN changes.
            </p>
          </div>
        </section>
        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
