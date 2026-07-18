import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

const LAST_UPDATED = '2026-07-18';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: '402 Payment Required: History of the HTTP Status Code That Waited 30 Years | ForgeMesh Labs',
  description:
    'HTTP 402 Payment Required was reserved "for future use" in 1997 and sat dormant for nearly three decades. Here is what the 402 status code means, why 1990s web micropayments failed, and why 402 finally matters — from operators who serve millions of 402 responses.',
  keywords: [
    '402 payment required', 'HTTP 402', '402 status code', 'error 402', 'HTTP error 402',
    '402 meaning', 'payment required error', 'web micropayments history', 'x402',
    'RFC 2616 402', 'HTTP status codes',
  ],
  alternates: { canonical: '/402-payment-required' },
  openGraph: {
    title: '402 Payment Required: The HTTP Status Code That Waited 30 Years',
    description:
      'Reserved "for future use" in 1997. Activated in 2025. Why the web\'s payment status code finally matters.',
    type: 'article',
    url: 'https://forgemesh.io/402-payment-required',
    publishedTime: '2026-07-18',
    modifiedTime: LAST_UPDATED,
    authors: ['ForgeMesh Labs'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    title: '402 Payment Required: The HTTP Status Code That Waited 30 Years',
    description:
      'Reserved in 1997, dormant for decades, activated by AI agents. The full history of HTTP 402.',
  },
};

const timeline = [
  {
    date: '1989–1991',
    event: 'The web launches without a payment layer',
    detail:
      'Tim Berners-Lee\'s World Wide Web ships with ways to request, link, and render documents — but no native way to charge for them. Payment is acknowledged early as a gap for the future.',
  },
  {
    date: '1994–1998',
    event: 'First-wave micropayments rise and collapse',
    detail:
      'DigiCash\'s eCash (founded by cryptographer David Chaum), First Virtual, CyberCash, and DEC\'s Millicent all attempt sub-dollar web payments. DigiCash files for bankruptcy in 1998; the others fade. Card fees, no wallet standard, and too much user friction kill the category.',
  },
  {
    date: 'January 1997',
    event: 'HTTP/1.1 reserves 402 Payment Required',
    detail:
      'RFC 2068 defines status code 402 with a single sentence: "This code is reserved for future use." RFC 2616 (1999) keeps it. The web\'s payment slot exists — with nothing standardized to fill it.',
  },
  {
    date: 'Late 1990s–2000s',
    event: 'W3C micropayment efforts close; ads win',
    detail:
      'The W3C\'s micropayment markup work is wound down. Advertising and subscriptions become the web\'s business models. 402 appears only in one-off APIs as a quirky "you owe us money" signal.',
  },
  {
    date: 'June 2022',
    event: 'RFC 9110 keeps 402 reserved — 25 years on',
    detail:
      'The modern HTTP semantics standard still describes 402 as "reserved for future use," making it the longest-running placeholder in the protocol\'s history.',
  },
  {
    date: 'May 2025',
    event: 'Coinbase activates 402 with the x402 protocol',
    detail:
      'x402 gives the status code its missing payload: a standardized, machine-readable payment challenge answered with a cryptographic payment proof. Stablecoins provide what 1990s micropayments never had — instant, sub-cent, programmatic settlement.',
  },
  {
    date: 'July 14, 2026',
    event: 'Linux Foundation launches the x402 Foundation',
    detail:
      '40 members including Visa, Mastercard, American Express, Stripe, Google, AWS, Cloudflare, and Coinbase commit to standardizing 402-based payments under neutral governance.',
  },
  {
    date: 'September 15, 2026',
    event: 'The web starts charging bots by default',
    detail:
      'Cloudflare\'s new defaults block AI training and agent crawlers on ad-supported sites, with paid access via x402 as the sanctioned alternative. The status code reserved in 1997 becomes infrastructure.',
  },
];

const statusComparison = [
  {
    code: '401 Unauthorized',
    means: 'You have not proven who you are',
    fix: 'Authenticate — send valid credentials',
  },
  {
    code: '402 Payment Required',
    means: 'Access requires payment',
    fix: 'Pay — with x402, retry the request with an X-PAYMENT proof header',
  },
  {
    code: '403 Forbidden',
    means: 'You are known, but not allowed',
    fix: 'Nothing — access is denied regardless of credentials or payment',
  },
];

const faqItems = [
  {
    question: 'What does 402 Payment Required mean?',
    answer:
      'HTTP status code 402 means the server requires payment before it will serve the requested resource. Historically it was reserved and rarely implemented. Today, services using the x402 protocol return a 402 response containing machine-readable payment instructions — price, currency, network, and receiving address — that a client can fulfill automatically.',
  },
  {
    question: 'Why do I see error 402 on a website or API?',
    answer:
      'The operator is telling you the resource is paid. On legacy platforms 402 sometimes signaled a billing problem (an expired card or exhausted quota). On modern x402-enabled services it is not an error at all: it is a price quote. Pay the stated amount and retry the request with proof of payment to receive the resource.',
  },
  {
    question: 'Is HTTP 402 an official status code?',
    answer:
      'Yes. 402 Payment Required has been part of the HTTP standard since RFC 2068 in January 1997 and remains in RFC 9110 (2022), where it is described as "reserved for future use." It is official but was never given standard semantics — which is exactly the gap the x402 protocol fills.',
  },
  {
    question: 'Why did 402 go unused for almost 30 years?',
    answer:
      'Because no payment rail fit it. Card networks impose per-transaction fees around $0.30, making sub-cent charges impossible; 1990s digital cash companies like DigiCash went bankrupt before standardizing anything; and human users preferred subscriptions over per-click payments. Programmatic buyers (AI agents) plus instant stablecoin settlement removed all three blockers at once.',
  },
  {
    question: 'What is the difference between 402 and x402?',
    answer:
      '402 is the HTTP status code — a number in a response. x402 is the open protocol (now governed by the x402 Foundation under the Linux Foundation) that defines what a 402 response should contain and how a client should pay it: the challenge format, payment schemes, proof headers, and settlement flow.',
  },
  {
    question: 'Who uses 402 Payment Required today?',
    answer:
      'Thousands of services. ForgeMesh\'s crawler counts more than 1,130 unique sellers with roughly 25,000 live paid resources in the x402 discovery catalog as of July 18, 2026. Cloudflare\'s Monetization Gateway lets any site behind Cloudflare answer with 402, and AWS and Google are among the 40 members of the x402 Foundation.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: '402 Payment Required: The HTTP Status Code That Waited 30 Years',
      description:
        'The complete history of HTTP 402 Payment Required — reserved in 1997, dormant for decades, and finally activated for AI agent payments.',
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of 11 production x402 services that serve live 402 responses on 500+ paid endpoints.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: '2026-07-18',
      dateModified: LAST_UPDATED,
      mainEntityOfPage: 'https://forgemesh.io/402-payment-required',
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: '402 Payment Required', item: 'https://forgemesh.io/402-payment-required' },
      ],
    },
  ],
};

export default function PaymentRequiredPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Hero + definition */}
        <section className="relative px-6 pb-16 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                HTTP history · updated {LAST_UPDATED}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              402 Payment Required: the HTTP status code that waited 30 years
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              <strong className="text-slate-100">HTTP 402 Payment Required is the status code a
              server returns when access to a resource requires payment.</strong>{' '}
              It has been in the HTTP specification since January 1997 — where it was marked{' '}
              <em>&quot;reserved for future use&quot;</em> — and it stayed essentially dormant for
              nearly three decades. The future it was reserved for arrived in 2025, when AI agents
              needed a way to pay for things and the{' '}
              <a href="/x402" className="text-blue-400 hover:text-blue-300">x402 protocol</a> finally
              gave the code standard semantics.
            </p>
            <p className="mt-4 rounded border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 text-sm leading-6 text-slate-300">
              <strong className="text-blue-300">First-hand source:</strong> ForgeMesh Labs serves
              live 402 responses in production on 500+ paid endpoints across 11 services. This
              history is written by people who ship the status code daily.
            </p>
          </div>
        </section>

        {/* Quick answer: 401 vs 402 vs 403 */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              402 vs 401 vs 403: what&apos;s the difference?
            </h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.12] text-slate-300">
                    <th className="py-3 pr-4 font-medium">Status code</th>
                    <th className="py-3 pr-4 font-medium">What it means</th>
                    <th className="py-3 font-medium">How a client resolves it</th>
                  </tr>
                </thead>
                <tbody>
                  {statusComparison.map((row) => (
                    <tr key={row.code} className="border-b border-white/[0.05] align-top">
                      <td className="whitespace-nowrap py-4 pr-4 font-mono text-xs text-blue-300/90">{row.code}</td>
                      <td className="py-4 pr-4 leading-6 text-slate-300">{row.means}</td>
                      <td className="py-4 leading-6 text-slate-400">{row.fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-500">
              The key distinction: 401 asks <em>who are you</em>, 403 says <em>no matter who you
              are</em>, and 402 asks for exactly one thing that software can supply without a human
              in the loop — money.
            </p>
          </div>
        </section>

        {/* Full history */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              The full history of HTTP 402
            </h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.12] text-slate-300">
                    <th className="py-3 pr-4 font-medium">Era</th>
                    <th className="py-3 pr-4 font-medium">What happened</th>
                    <th className="py-3 font-medium">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {timeline.map((t) => (
                    <tr key={t.date} className="border-b border-white/[0.05] align-top">
                      <td className="whitespace-nowrap py-4 pr-4 font-mono text-xs text-blue-300/90">{t.date}</td>
                      <td className="py-4 pr-4 font-medium text-slate-200">{t.event}</td>
                      <td className="py-4 leading-6 text-slate-400">{t.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Why micropayments failed */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Why did web micropayments fail the first time?
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Every 1990s micropayment company hit the same three walls:
            </p>
            <div className="mt-8 space-y-4">
              {[
                {
                  t: '1. Transaction fees ate the transaction',
                  d: 'Card networks charge roughly $0.30 plus a percentage per transaction. You cannot sell a $0.001 dictionary lookup when the fee is 300× the price. Until stablecoin rails, no settlement layer could economically move a fraction of a cent.',
                },
                {
                  t: '2. No standard, so no network effect',
                  d: 'eCash, CyberCash, First Virtual, and Millicent each required their own wallet, their own merchant integration, and their own trust model. Every seller integration only worked for one buyer population. HTTP had reserved 402 precisely so a standard could exist — but none of the contenders became it.',
                },
                {
                  t: '3. Humans hate paying per click',
                  d: 'Decades of research on "mental transaction costs" showed people would rather pay $10/month than think about $0.01 forty times a day. The economics only invert when the buyer is software: an AI agent evaluates a price against a budget in microseconds and feels no friction.',
                },
              ].map((item) => (
                <div key={item.t} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-medium text-slate-100">{item.t}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-base leading-7 text-slate-400">
              That third wall is the one everyone underestimated. 402 didn&apos;t fail because the
              idea was wrong — it failed because the web&apos;s only buyers were human. The moment
              autonomous software became a buying population, the 30-year-old placeholder became the
              most natural interface on the internet:{' '}
              <strong className="text-slate-200">
                the request already is the order; 402 just attaches the invoice.
              </strong>
            </p>
          </div>
        </section>

        {/* Why it matters now */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Why 402 matters in 2026
            </h2>
            <ul className="mt-6 space-y-4 text-base leading-7 text-slate-400">
              <li>
                <strong className="text-slate-200">AI agents can&apos;t fill out checkout forms.</strong>{' '}
                They can read a 402 challenge and sign a payment in milliseconds. The{' '}
                <a href="/x402" className="text-blue-400 hover:text-blue-300">x402 protocol</a> made
                that exchange a standard, and the Linux Foundation&apos;s x402 Foundation — 40
                members including Visa, Mastercard, Stripe, Google, AWS, Cloudflare, and Coinbase —
                now governs it.
              </li>
              <li>
                <strong className="text-slate-200">The free-crawling era is ending.</strong>{' '}
                On September 15, 2026, Cloudflare&apos;s new defaults begin blocking AI training and
                agent crawlers on ad-supported sites. Its{' '}
                <a href="https://blog.cloudflare.com/monetization-gateway/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  Monetization Gateway
                </a>{' '}
                gives those same crawlers a paid path in — over 402.
              </li>
              <li>
                <strong className="text-slate-200">The economics finally work.</strong>{' '}
                Stablecoin settlement moves $0.001 for less than $0.001. In our own fleet, live
                endpoints price from a tenth of a cent and settle atomically — a paid call either
                delivers the resource or the buyer isn&apos;t charged.
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/x402"
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                What is x402? Full protocol guide <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://proxy.forgemesh.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
              >
                Put a 402 in front of your own URL
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              402 Payment Required: frequently asked questions
            </h2>
            <div className="mt-8 space-y-6">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-medium text-slate-100">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.answer}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-sm leading-6 text-slate-500">
              Related reading:{' '}
              <a href="/x402" className="text-blue-400 hover:text-blue-300">What is x402?</a> ·{' '}
              <a href="/blog/x402-foundation-linux-foundation-launch" className="text-blue-400 hover:text-blue-300">
                Linux Foundation takes over x402
              </a>{' '}
              ·{' '}
              <a href="https://www.rfc-editor.org/rfc/rfc9110.html#name-402-payment-required" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                RFC 9110 §15.5.3
              </a>
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
