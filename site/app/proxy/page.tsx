import type { Metadata } from 'next';
import {
  BadgeCheck,
  Bot,
  CircleDollarSign,
  Link2,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'x402 Proxy - Paywall Any URL for AI Agents | ForgeMesh Labs',
  description:
    'Paywall any URL you control in minutes, no code. AI agents pay per request in USDC on Base. Payments go straight to your own on-chain split contract — we never hold your money.',
  applicationName: 'x402 Proxy',
  keywords: [
    'x402 proxy',
    'paywall API',
    'monetize API',
    'agent payments',
    'pay per request API',
    'USDC micropayments',
    'Base mainnet',
    'x402 protocol',
    'agent commerce',
    'API monetization',
    'non-custodial payouts',
    '0xSplits',
  ],
  alternates: {
    canonical: '/proxy',
  },
  openGraph: {
    title: 'x402 Proxy - Paywall Any URL for AI Agents',
    description:
      'Paste a URL, set a price, get paid in USDC when AI agents call it. Non-custodial: payments land in your own on-chain split contract.',
    url: 'https://forgemesh.io/proxy',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'x402 Proxy',
    description: 'Paywall any URL for AI agents. Non-custodial USDC payouts on Base.',
  },
};

const steps = [
  {
    title: 'Verify your domain',
    text: 'Publish one DNS TXT record (or a file) to prove you control the domain. You can only paywall what is yours — we re-check daily and pause routes if the record disappears.',
    icon: BadgeCheck,
  },
  {
    title: 'Paste a URL, set a price',
    text: 'Any public endpoint or resource on a domain you have verified. Price it from $0.001 to $100 per request. No code, no SDK, no server changes.',
    icon: Link2,
  },
  {
    title: 'Agents pay per request',
    text: 'You get a proxy link. Agents that hit it get a standard x402 challenge, pay in USDC on Base, and receive your content. The proxy is listed for agent discovery automatically.',
    icon: Bot,
  },
  {
    title: 'Money lands in your split',
    text: 'Each payment settles directly into an immutable on-chain split contract — 85% you, 15% us. We never take possession of your share, and cannot redirect it.',
    icon: Lock,
  },
];

const custodyPoints = [
  {
    title: 'We never hold your money',
    text: 'Payments do not pass through a ForgeMesh wallet. They settle to a per-creator 0xSplits contract whose 85/15 allocation is fixed in the contract itself.',
  },
  {
    title: 'Nobody can redirect it — including us',
    text: 'The split address is deterministic and immutable. The only transaction that can move funds sitting there is the one that pays out 85/15. Verify it yourself on Basescan.',
  },
  {
    title: 'Payouts are permissionless',
    text: 'We trigger distribution monthly and cover the gas, but distribution is open to anyone. You can push your own funds to your wallet at any time, with or without us.',
  },
];

const faqItems = [
  {
    question: 'What is x402 Proxy?',
    answer:
      'x402 Proxy is a hosted platform from ForgeMesh Labs that puts a USDC paywall in front of any URL you control. AI agents pay per request using the x402 protocol on Base mainnet, and you keep 85% of every payment.',
  },
  {
    question: 'Do I need to write any code?',
    answer:
      'No. You verify your domain, paste the URL you want to paywall, and set a price. The proxy handles the x402 payment challenge, verification, settlement, and discovery listing for you.',
  },
  {
    question: 'Does ForgeMesh hold my earnings?',
    answer:
      'No. Payments settle directly to an immutable on-chain 0xSplits contract that allocates 85% to your wallet and 15% to ForgeMesh. Your share never enters a ForgeMesh wallet, and the allocation cannot be changed by anyone, including us.',
  },
  {
    question: 'When do I get paid?',
    answer:
      'Distribution runs monthly for balances of $1 or more, and ForgeMesh pays the gas. Because distribution is permissionless, you can also trigger it yourself from the split contract at any time.',
  },
  {
    question: 'What can I paywall?',
    answer:
      'Any URL on a domain you have verified and have the rights to monetize — an API endpoint, a dataset, a report, a feed. You may not paywall content that is illegal, infringing, or that you do not have rights to monetize.',
  },
  {
    question: 'Why would an AI agent pay for my data?',
    answer:
      'Agents increasingly buy data at runtime instead of scraping it. x402 is an open payment standard for exactly this, and paid routes are published to agent discovery surfaces so agents can find and pay for them without a human in the loop.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Nothing to set up. ForgeMesh takes a 15% commission on each payment; you keep 85%. There is no subscription and no monthly fee.',
  },
];

const howToSteps = [
  'Sign in at proxy.forgemesh.io with an email link or a wallet signature.',
  'Add your payout wallet — any Base address.',
  'Add your domain and publish the DNS TXT record we give you, then click Check now.',
  'Paste the URL you want to paywall and set a price per request.',
  'Share the proxy link, or let agents discover it automatically.',
];

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'x402 Proxy',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://forgemesh.io/proxy',
    author: {
      '@type': 'Organization',
      name: 'ForgeMesh Labs',
      url: 'https://forgemesh.io',
    },
    description:
      'Paywall any URL you control with x402 USDC micropayments on Base. AI agents pay per request; payouts settle non-custodially to an on-chain split contract.',
    keywords:
      'x402 proxy, paywall API, monetize API, agent payments, USDC micropayments, Base mainnet, non-custodial payouts',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description:
        'Free to set up. ForgeMesh retains a 15% commission on each payment; the creator keeps 85%.',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to paywall a URL for AI agents with x402 Proxy',
    description:
      'Verify your domain, paste a URL, set a price, and get paid in USDC when AI agents call it.',
    step: howToSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step,
    })),
  },
];

function FlowPanel() {
  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-[#07070d] p-4 shadow-[0_24px_80px_-42px_rgba(59,130,246,0.65)]">
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-blue-400/70" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-600">
          Agent pays for your data
        </span>
      </div>
      <div className="space-y-3 font-mono text-xs leading-relaxed text-slate-300 sm:text-sm">
        <div className="grid grid-cols-[auto_1fr] gap-3">
          <span className="text-blue-400">$</span>
          <span className="break-words">curl https://proxy.forgemesh.io/p/your-route</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-3 text-slate-500">
          <span className="text-slate-600">→</span>
          <span className="break-words">402 Payment Required — $0.05 USDC on Base</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-3 text-slate-500">
          <span className="text-slate-600">→</span>
          <span className="break-words">agent pays · settles to your split contract</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-3">
          <span className="text-blue-400">←</span>
          <span className="break-words text-slate-300">200 OK — your data, delivered</span>
        </div>
      </div>
      <div className="mt-5 rounded-xl border border-blue-400/10 bg-blue-400/[0.04] p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-300/80">
          Your cut, per call
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          85% lands in your on-chain split the moment the agent pays. No invoice, no payout request,
          no ForgeMesh wallet in the middle.
        </p>
      </div>
    </div>
  );
}

export default function ProxyPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
                <ForgeMeshMark size={22} className="shrink-0" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                  Hosted paywall platform · beta
                </span>
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[0.98] tracking-tight text-slate-50 sm:text-6xl">
                Paywall any link in minutes. No code.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                Wrap any URL you control with USDC micropayments on Base. AI agents pay per request —
                and the money goes straight to your own on-chain split contract, never through us.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://proxy.forgemesh.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-5 py-3 text-sm font-medium text-slate-950 transition active:translate-y-px"
                >
                  Start paywalling
                </a>
                <a
                  href="https://proxy.forgemesh.io/faq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-400/40 active:translate-y-px"
                >
                  How it works
                </a>
              </div>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-600">
                You keep 85% · payouts monthly from $1 · no subscription
              </p>
            </div>
            <FlowPanel />
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
              From URL to paid endpoint
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-blue-400/25"
                >
                  <step.icon className="h-5 w-5 text-blue-400/80" aria-hidden />
                  <h3 className="mt-4 text-base font-medium text-slate-100">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-blue-400/80" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Non-custodial by construction
              </span>
            </div>
            <h2 className="mt-6 max-w-3xl text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
              Most platforms hold your money and promise to pay you. We built it so we can&rsquo;t.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {custodyPoints.map((point) => (
                <div
                  key={point.title}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
                >
                  <h3 className="text-base font-medium text-slate-100">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{point.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-slate-500">
              Splits are powered by{' '}
              <a
                href="https://splits.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 underline decoration-white/20 underline-offset-4 hover:text-blue-300"
              >
                0xSplits
              </a>{' '}
              on Base mainnet. The contract is immutable and public — your allocation is not a promise
              in our terms of service, it is code you can read.
            </p>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
                  <CircleDollarSign className="h-4 w-4 text-blue-400/80" aria-hidden />
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                    Pricing
                  </span>
                </div>
                <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
                  Free to start. 15% when you earn.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  No subscription, no listing fee, no minimum. You set the price per request, from
                  $0.001 to $100. ForgeMesh takes 15% of each payment; the other 85% is yours,
                  enforced on-chain.
                </p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <dl className="divide-y divide-white/[0.06]">
                  {[
                    ['Setup', 'Free'],
                    ['Subscription', 'None'],
                    ['Commission', '15% per payment'],
                    ['Your share', '85%, settled on-chain'],
                    ['Payout threshold', '$1 — monthly, gas on us'],
                    ['Network', 'USDC on Base mainnet'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-6 py-3">
                      <dt className="text-sm text-slate-400">{label}</dt>
                      <dd className="text-right font-mono text-xs text-slate-200 sm:text-sm">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
              Questions
            </h2>
            <div className="mt-10 space-y-4">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
                >
                  <summary className="cursor-pointer list-none text-base font-medium text-slate-100 marker:hidden">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
              Your data is worth something to agents.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
              Setup takes minutes and costs nothing. The agentic market is still early — earnings are
              possible, never promised.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="https://proxy.forgemesh.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-5 py-3 text-sm font-medium text-slate-950 transition active:translate-y-px"
              >
                Open x402 Proxy
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
