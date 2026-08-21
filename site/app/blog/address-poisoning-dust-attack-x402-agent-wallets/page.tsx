import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';

const PUBLISHED = '2026-08-21';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'We Funded a Wallet at Breakfast. Scammers Impersonated It by Lunch. | ForgeMesh Labs',
  description:
    'Minutes into a routine payment sweep, our revenue feed showed two $0.00 "payments" from what looked like our own wallet. It was an address-poisoning dust attack — a lookalike address ground to match ours on the exact characters everything truncates to. What happened, how the scam works in plain language, why the agent economy is its perfect target, and the checklist that makes it harmless.',
  keywords: [
    'address poisoning', 'dust attack', 'crypto wallet security', 'x402 security',
    'agent wallet', 'agent payments', 'USDC Base', 'vanity address scam',
    'copy paste crypto scam', 'AI agent economy', 'wallet hygiene',
  ],
  alternates: { canonical: '/blog/address-poisoning-dust-attack-x402-agent-wallets' },
  openGraph: {
    title: 'We Funded a Wallet at Breakfast. Scammers Impersonated It by Lunch.',
    description:
      'Two $0.00 "payments" in our revenue feed turned out to be an address-poisoning attack: a lookalike wallet matching ours on the first and last characters — the only ones anyone ever sees. How the scam works, why agent operators are its perfect target, and the habits that make it harmless.',
    type: 'article',
    url: 'https://forgemesh.io/blog/address-poisoning-dust-attack-x402-agent-wallets',
    publishedTime: PUBLISHED,
    modifiedTime: PUBLISHED,
    authors: ['ForgeMesh Labs'],
    images: ['/blog/address-poisoning-dust-attack-x402-agent-wallets.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/blog/address-poisoning-dust-attack-x402-agent-wallets.png'],
    title: 'The $0.00 payment in your feed is an attack',
    description:
      'We funded an agent wallet in the morning. By midday a lookalike address — same first four characters, same last four — was dusting our revenue wallet to poison its history. Address poisoning has found the agent economy.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'We Funded a Wallet at Breakfast. Scammers Impersonated It by Lunch.',
      description:
        'A field report on an address-poisoning dust attack against an x402 fleet: a vanity address matching the operator wallet on its first and last characters dusted the revenue wallet minutes after the real wallet went active. Explains the attack in plain language and gives a defense checklist for x402 builders and non-technical operators.',
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of a fleet of paid x402 and MPP services with 800+ indexed resources.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      mainEntityOfPage: 'https://forgemesh.io/blog/address-poisoning-dust-attack-x402-agent-wallets',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://forgemesh.io/blog' },
        { '@type': 'ListItem', position: 3, name: 'Address poisoning and the agent economy', item: 'https://forgemesh.io/blog/address-poisoning-dust-attack-x402-agent-wallets' },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <article className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto flex max-w-6xl justify-center gap-12">
            <div className="min-w-0 max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Field notes · <time dateTime={PUBLISHED}>{PUBLISHED}</time>
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              We funded a wallet at breakfast. Scammers impersonated it by lunch.
            </h1>

            <img
              src="/blog/address-poisoning-dust-attack-x402-agent-wallets.png"
              alt="Two nearly identical wallet addresses, one genuine and one forged"
              className="mt-8 w-full rounded border border-white/[0.06]"
              width={1200}
              height={630}
            />

            <p className="mt-6 text-lg leading-8 text-slate-300">
              This morning we topped up our fleet&rsquo;s payer wallet with $15 of USDC and ran a
              routine payment sweep — 22 real micropayments across every service we operate, to
              prove the rails end to end. Minutes into the sweep, our revenue channel on Discord
              pinged twice with something that should be impossible: a{' '}
              <strong className="text-slate-100">$0.0000 payment</strong>. Our cheapest endpoint
              costs $0.001. Nothing on our fleet can produce a zero-dollar sale. Whatever those two
              alerts were, they weren&rsquo;t customers.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The tell was four characters on each end
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              We pulled the transaction from the chain. It wasn&rsquo;t a payment at all — it was a
              batch transaction spraying microscopic amounts of USDC, a hundredth of a cent at a
              time, to dozens of unrelated wallets. Buried in the batch was a transfer of
              $0.000015 to one of our revenue wallets. And the sender was the interesting part:
            </p>
            <div className="mt-6 space-y-3 rounded border border-white/[0.06] bg-white/[0.02] p-6 font-mono text-[13px] leading-7">
              <div>
                <span className="text-slate-500">our real payer wallet</span>
                <div className="break-all text-blue-200">
                  0x<span className="text-emerald-300">4C41</span>38cf1cB7db0A48476B2c808Cb3ce0DD1<span className="text-emerald-300">f807</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500">the attacker&rsquo;s wallet</span>
                <div className="break-all text-blue-200">
                  0x<span className="text-emerald-300">4c41</span>8416ffd4ee80aeb7d3b1bb275b835322<span className="text-emerald-300">7807</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Same first four characters. Same last four characters. Everything in between —
              thirty-four characters of it — completely different. That&rsquo;s not a coincidence:
              wallet addresses are effectively random, so an attacker can cheaply grind through
              millions of candidate wallets until one happens to start and end with the same
              characters as yours. It costs them nothing but compute, and it only has to match on
              the parts people actually look at. Because here is the uncomfortable truth every
              wallet app, block explorer, and Discord bot shares: they all display addresses
              truncated, as <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[13px] text-blue-200">0x4c41…7807</code>.
              Both wallets above render identically in almost every interface you use.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The scam, in plain language
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              It&rsquo;s called <strong className="text-slate-200">address poisoning</strong>, and
              the dust transfer is not the theft — it&rsquo;s the setup. By sending a fraction of a
              cent from their lookalike wallet to yours, the attacker plants their address in your
              wallet&rsquo;s transaction history. It now sits there looking exactly like your own
              wallet, one line among your real transactions. Then they wait. The payoff comes weeks
              or months later, the day you — or your bookkeeper, or your automation — need to send
              funds and grab the address the fast way: scroll the history, spot the familiar{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[13px] text-blue-200">0x4c41…7807</code>,
              copy, paste, send. The money goes to the attacker, and on a blockchain there is no
              undo button, no fraud department, no chargeback. This scam has taken tens of
              millions of dollars from real victims — the most famous single case lost $68 million
              in one copy-pasted transfer.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              What startled us was the speed
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { n: '~4 hrs', d: 'between funding the wallet with $15 and the first poisoning attempt landing in our revenue wallet' },
                { n: '2 hits', d: 'dust transfers at 11:54 and 11:58 UTC — both fired while our payment sweep was still running' },
                { n: '$0.000015', d: 'the cost of each attempt. Grinding the lookalike address costs the attacker nothing but electricity' },
              ].map((s) => (
                <div key={s.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="text-3xl font-semibold text-blue-300">{s.n}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{s.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-base leading-8 text-slate-400">
              Nobody targeted us personally. Bots watch the chain for freshly funded, newly active
              wallets, auto-generate a lookalike, and dust every counterparty the target touches —
              all in the same breath as the activity itself. Our wallet started making payments;
              within minutes, machinery on the other side was seeding fake history into the wallets
              we&rsquo;d paid. It is fully industrialized, and it costs the attacker so little that{' '}
              <em>every</em> active wallet gets this treatment eventually. Yours will too. The only
              question is whether it matters when it happens.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Why the agent economy is the perfect target
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Address poisoning is old news in DeFi. But x402 and agent payments make an unusually
              rich hunting ground, for three reasons that are structural, not incidental.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-1">
              {[
                {
                  n: 'Hot wallets, constant motion',
                  d: 'Selling to agents means operating wallets that pay and get paid all day in small amounts. Every transfer is a fresh signal to the poisoning bots and a fresh line of history for a fake address to hide in. A cold-storage whale gets dusted once; an x402 operator gets dusted on schedule.',
                },
                {
                  n: 'Addresses travel through chat',
                  d: 'Agent operators live in Discord alerts, dashboards, and monitoring feeds — surfaces that all truncate addresses to first-and-last characters, the exact format the attack is built to exploit. We take our own wallet address from a Discord bot more often than we&rsquo;d like to admit. That habit is precisely what the attacker is betting on.',
                },
                {
                  n: 'The agents themselves can be victims',
                  d: 'An automation that "tops up the usual wallet" by reading recent transaction history — a completely natural thing to build — will copy the poisoned address without ever feeling suspicious. Software doesn&rsquo;t squint at the middle characters unless you tell it to. As more non-technical builders wire up agents that move money, this failure mode ships by default.',
                },
              ].map((b) => (
                <div key={b.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="text-base font-semibold text-blue-300">{b.n}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{b.d}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The defense is boring, and it works completely
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Here&rsquo;s the good news: this attack has a 100% cure, and it costs nothing. The
              dust in your wallet is harmless — it&rsquo;s real money, it can&rsquo;t hurt you
              sitting there, and you never need to touch it. The attack only ever succeeds at the
              moment someone copies the wrong address. Remove that moment and the whole industry
              of it goes dark. Habits, in order of importance:
            </p>
            <div className="mt-6 space-y-4">
              {[
                {
                  n: '1. Never copy an address out of transaction history',
                  d: 'Not from a block explorer, not from a Discord alert, not from your wallet&rsquo;s activity feed. History is the one surface the attacker can write to. Keep your own addresses in one trusted place — a doc, a password manager, your service config — and copy from there, every time.',
                },
                {
                  n: '2. Check the middle, not the ends',
                  d: 'The first and last four characters are exactly what the attacker matched. If you verify an address by eye, read a chunk from the middle — the attacker almost certainly couldn&rsquo;t afford to match those too.',
                },
                {
                  n: '3. Give your automations an address book, not a search habit',
                  d: 'Any agent or script that sends funds should have its destination addresses pinned in configuration and compare them full-length, character for character. Never let software derive a destination from chain history. One line of config is the difference between immune and exposed.',
                },
                {
                  n: '4. Make your monitoring refuse to repeat the lie',
                  d: 'Our Discord bot faithfully relayed the attacker&rsquo;s transfer as a $0.0000 payment — which put the poisoned address in front of exactly the humans it was aimed at. We patched it the same hour: transfers below our cheapest real price are now logged as suspected poisoning and never alerted. If your fleet has a price floor, your alerts should enforce it.',
                },
                {
                  n: '5. Test-send before large transfers',
                  d: 'Moving something that would hurt to lose? Send a token amount first, confirm it arrived at the destination you meant, then send the rest. Thirty seconds of ceremony, permanent immunity to the worst version of this.',
                },
              ].map((b) => (
                <div key={b.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="text-base font-semibold text-blue-300">{b.n}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{b.d}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              The part that stays with us
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              The attack cost thirty-thousandths of a cent and was launched by a bot within
              minutes of our wallet doing anything worth impersonating. It failed here for an
              unglamorous reason: a $0.00 payment looked wrong to someone who knew the fleet&rsquo;s
              cheapest price, and we pulled the transaction instead of shrugging. That&rsquo;s the
              whole lesson. As agent payments pull in builders who&rsquo;ve never had to think like
              a blockchain security auditor — which is the point of x402, and a good thing — the
              defenses have to live in habits and tooling, not vigilance. Vigilance doesn&rsquo;t
              scale. Address books, full-length comparisons, and alert thresholds do.
            </p>

            <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Selling to agents?
              </p>
              <p className="mt-3 text-base leading-7 text-slate-300">
                We publish everything we learn operating 500+ paid x402 endpoints — including the
                incidents. The free scan checks whether stock agent clients can actually pay your
                endpoint, and the Server Starter Kit ships the settlement-proven dual-rail
                middleware we run in production, with updates dropped into buyers&rsquo; Discord as
                the ecosystem shifts.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://forgemesh.io/scan"
                  className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
                >
                  Run the free scan <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href="https://kit.forgemesh.io"
                  className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
                >
                  Get the Server Starter Kit — $49
                </a>
              </div>
            </div>

            <p className="mt-10 text-base leading-8 text-slate-400">
              Related reading:{' '}
              <a href="/blog/x402-v1-v2-client-split-your-endpoint-may-be-unpayable" className="text-blue-400 hover:text-blue-300">
                the silent v1/v2 client split that made correct endpoints unpayable
              </a>{' '}
              and{' '}
              <a href="/blog/x402-bazaar-health-census-august-2026" className="text-blue-400 hover:text-blue-300">
                our health census of every seller in the x402 Bazaar
              </a>
              .
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="/blog"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
              >
                More from the blog
              </a>
            </div>
            </div>
            <BlogArchive current="address-poisoning-dust-attack-x402-agent-wallets" />
          </div>
        </article>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
