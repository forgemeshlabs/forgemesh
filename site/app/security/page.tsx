import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Security & Trust | ForgeMesh Labs',
  description:
    'How ForgeMesh endpoints are protected today: TLS 1.3 with X25519MLKEM768 hybrid key exchange, what x402 payments do and do not protect, and what we do not claim.',
  alternates: { canonical: '/security' },
  openGraph: {
    title: 'Security & Trust | ForgeMesh Labs',
    description:
      'Transport, payments and non-claims, stated so you can verify them yourself.',
    url: 'https://forgemesh.io/security',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Security & Trust | ForgeMesh Labs',
    description:
      'How ForgeMesh endpoints are protected today, stated so you can verify it yourself.',
  },
  robots: { index: true, follow: true },
};

const VERIFIED = '2026-09-29';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://forgemesh.io/security',
      url: 'https://forgemesh.io/security',
      name: 'Security & Trust | ForgeMesh Labs',
      description:
        'How ForgeMesh endpoints are protected today, stated so you can verify it yourself.',
      isPartOf: { '@type': 'WebSite', url: 'https://forgemesh.io', name: 'ForgeMesh Labs' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Security & Trust', item: 'https://forgemesh.io/security' },
      ],
    },
  ],
};

const VERIFY_CMD = `echo | openssl s_client -connect forgemesh.io:443 -servername forgemesh.io -tls1_3 2>/dev/null | grep "Negotiated TLS1.3 group"
# → Negotiated TLS1.3 group: X25519MLKEM768`;

export default function Page() {
  return (
    <>
      <NavBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main id="main-content" className="min-h-screen bg-[#050509] text-slate-100">
        <section className="px-6 pb-16 pt-28 sm:pt-36">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Security · verified {VERIFIED}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-slate-50 sm:text-5xl">
              Security &amp; Trust
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-400">
              How ForgeMesh endpoints are protected today, stated so you can verify it yourself.
            </p>

            <div className="mt-12 space-y-10 text-[15px] leading-7 text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-slate-50">Transport (verified {VERIFIED})</h2>
                <p className="mt-3">
                  Every ForgeMesh endpoint negotiates TLS 1.3 with the X25519MLKEM768 hybrid key
                  exchange at the edge. That is NIST FIPS 203 ML-KEM on every handshake today, so
                  recorded traffic is not a harvest-now-decrypt-later target.
                </p>
                <p className="mt-3">Check it yourself:</p>
                <pre className="mt-3 overflow-x-auto rounded border border-white/[0.08] bg-white/[0.03] p-4 font-mono text-[13px] leading-6 text-slate-200">
                  <code>{VERIFY_CMD}</code>
                </pre>
                <p className="mt-3 text-sm text-slate-500">
                  Requires OpenSSL 3.5 or newer. Swap in any ForgeMesh hostname.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">Payments</h2>
                <p className="mt-3">
                  On-chain x402 settlement uses the chain&rsquo;s native signature scheme (secp256k1 on
                  Base), which is not yet post-quantum. We keep payer balances minimal, use
                  receive-only addresses for revenue, and track the Base/Ethereum post-quantum
                  roadmap. We do not describe payments as quantum-safe.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">What we don&rsquo;t claim</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>No homemade cryptography.</li>
                  <li>
                    No &ldquo;quantum-safe&rdquo; claims beyond the transport statement above.
                  </li>
                  <li>
                    Symmetric integrity (HMAC-SHA256) on app-layer signatures, with an algorithm tag
                    published in signed payloads so verifiers can migrate.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-50">Report an issue</h2>
                <p className="mt-3">
                  <a href="mailto:hello@forgemesh.io" className="text-blue-400 hover:text-blue-300">hello@forgemesh.io</a>
                  . See also our{' '}
                  <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a> and{' '}
                  <a href="/terms" className="text-blue-400 hover:text-blue-300">Terms &amp; Disclaimer</a>.
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
