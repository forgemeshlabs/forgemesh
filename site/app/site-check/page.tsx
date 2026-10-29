import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { SiteChecker } from '@/components/SiteChecker';

const PAGE_URL = 'https://forgemesh.io/site-check';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Free Website Security Check: Email, TLS, Headers | ForgeMesh Labs',
  description:
    'Check any domain in five seconds: SPF, DKIM and DMARC, TLS versions and certificate, HTTPS redirect, HSTS, CSP, clickjacking, security.txt and more. Free summary; $5 for the full report with copy-paste fixes.',
  alternates: { canonical: PAGE_URL },
  openGraph: { type: 'website', url: PAGE_URL, title: 'Free website security check', description: 'The passive scan the cold-emailers charge for, free. Full report with fixes for $5.', siteName: 'ForgeMesh Labs' },
  twitter: { card: 'summary_large_image', title: 'Free website security check', description: 'SPF, DKIM, DMARC, TLS, HSTS, CSP, security.txt. Free summary, $5 full report with fixes.' },
};

const faq = [
  { q: 'What does it check?', a: 'Twenty-two passive checks in four areas. Email: SPF present, single and strict, DMARC present, single, enforced and reporting, DKIM key, MX. HTTPS: available, old TLS refused, TLS 1.3, certificate trusted and valid 30+ days, HTTP redirects. Headers: HSTS, Content-Security-Policy, clickjacking, nosniff, Referrer-Policy. Disclosure: security.txt, server version hidden, CAA.' },
  { q: 'Is it safe to run on my site?', a: 'Yes. It is read-only and uses public information only: DNS records, four TLS handshakes, and three page fetches with a named user agent. No login, no forms, no load testing, no redirects followed off your host. Private addresses are refused.' },
  { q: 'What is in the $5 report?', a: 'Every finding with the evidence we saw, what it means in plain language, and the exact fix: the DNS record value, the nginx or Apache line, or the Cloudflare switch. A prioritised roadmap, the full table of all checks, and a print-to-PDF layout. Re-check free for 30 days while you fix things.' },
  { q: 'Why is this free when others charge for it?', a: 'Because the same scan is what unsolicited "security researcher" emails offer, followed by a request for a bounty or a review. We received one, verified every finding, and built the check so you do not have to answer those emails.' },
  { q: 'Does a good grade mean my site is secure?', a: 'No. It means your public posture is in order: your mail cannot be spoofed easily, visitors always get HTTPS, and browsers are told what not to do. The application itself, its logins, forms and data handling are not tested here.' },
  { q: 'Can an agent use it?', a: 'Yes. The free summary is at GET forgemesh.io/api/site-check?domain=example.com, 20 calls per hour per address. The full report as structured JSON is POST x402.forgemesh.io/site-security-report with {"domain":"example.com"}, $5 per call in USDC on Base over x402 or MPP, no account or key: every check with evidence, severity, fix and roadmap. An unpaid request returns the payment challenge.' },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebApplication', name: 'ForgeMesh Site Security Check', url: PAGE_URL, applicationCategory: 'SecurityApplication', operatingSystem: 'Web', offers: [{ '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free summary' }, { '@type': 'Offer', price: '5', priceCurrency: 'USD', name: 'Full report with fixes' }], publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' } },
    { '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' }, { '@type': 'ListItem', position: 2, name: 'Site security check', item: PAGE_URL }] },
  ],
};

export default async function SiteCheckPage({ searchParams }: { searchParams: Promise<{ domain?: string }> }) {
  const sp = await searchParams;
  const initial = String(sp?.domain || '').slice(0, 253);
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Free check · 22 passive tests · $5 full report</span>
            </div>
            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">Can your email be spoofed? Does your site still take TLS 1.0?</h1>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              The passive security scan that lands in your inbox from a stranger asking for a bounty, run for free, on demand, with nothing touched. Email authentication, TLS and certificate, HTTPS redirect, browser security headers and disclosure. Five seconds. The full report with the fixes is five dollars.
            </p>
            <SiteChecker initial={initial} />

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">What the grades mean</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ['Email', 'SPF lists your senders, DKIM signs your mail, DMARC tells receivers what to do when both fail. With p=none, spoofed invoices from your domain are still delivered.'],
                ['HTTPS', 'A trusted certificate with weeks left, plain HTTP redirecting, TLS 1.0 and 1.1 refused. Old versions fail PCI DSS and let a downgraded client use weak ciphers.'],
                ['Headers and disclosure', 'HSTS, CSP, clickjacking and nosniff tell browsers what not to do. security.txt tells people who find a problem where to send it.'],
              ].map(([t, d]) => (
                <div key={t} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-medium text-slate-100">{t}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{d}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-14 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">FAQ</h2>
            <dl className="mt-4 divide-y divide-white/[0.06]">
              {faq.map((f) => (
                <div key={f.q} className="py-4">
                  <dt className="font-medium text-slate-100">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-6 text-slate-400">{f.a}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 rounded border border-white/[0.06] bg-white/[0.02] p-5">
              <h2 className="font-medium text-slate-100">For agents: the same report as JSON</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                POST x402.forgemesh.io/site-security-report with a domain, $5 per call in USDC on Base over x402 or MPP, no account or API key. Every check with evidence, severity, the fix and a roadmap, for audits and fleet sweeps.
              </p>
              <a href="https://x402.forgemesh.io/site-security-report" className="mt-4 inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20">Utility Grid route</a>
            </div>
            <p className="mt-10 text-sm leading-6 text-slate-500">
              Related: <a href="/quantum" className="text-blue-400 hover:text-blue-300">post-quantum TLS readiness</a>, <a href="/security" className="text-blue-400 hover:text-blue-300">how ForgeMesh handles security</a>, <a href="/wallet" className="text-blue-400 hover:text-blue-300">wallet setup guide</a>.
            </p>
          </div>
        </section>
        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
