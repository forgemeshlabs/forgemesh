import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Blog — x402, Agent Payments, and the Machine Economy | ForgeMesh Labs',
  description:
    'Field reports from operators of 11 x402 services and counting: protocol news, ecosystem data from our own crawler, and what it actually takes to sell to AI agents.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'ForgeMesh Labs Blog — x402 and the Machine Economy',
    description:
      'Protocol news and original ecosystem data from operators of 11 x402 services and counting.',
    type: 'website',
    url: 'https://forgemesh.io/blog',
    images: ['/fm-nobg.png'],
  },
};

const posts = [
  {
    slug: 'address-poisoning-dust-attack-x402-agent-wallets',
    date: '2026-08-21',
    title: 'We Funded a Wallet at Breakfast. Scammers Impersonated It by Lunch.',
    excerpt:
      'Minutes into a routine payment sweep, our revenue feed pinged with two $0.00 "payments" from what looked like our own wallet. It was an address-poisoning attack: a lookalike address ground to match ours on the first and last four characters — the only ones anything displays. How the scam works in plain language, why agent operators are its perfect target, and the five boring habits that make it harmless.',
  },
  {
    slug: 'x402-v1-v2-client-split-your-endpoint-may-be-unpayable',
    date: '2026-08-20',
    title: 'The x402 SDK Went v2. The Client Everyone Installs Didn’t. Your Endpoint May Be Unpayable.',
    excerpt:
      '@x402/core went v2 in December 2025 — the server SDK every current guide tells you to build on. x402-fetch, the most-installed client, last shipped April 16, 2026 as v1-only. Four silent wire-format breaks mean neither side ever sees an error while settlements quietly collapse. How we found it, and proved the fix with a real on-chain settlement.',
  },
  {
    slug: 'x402-bazaar-health-census-august-2026',
    date: '2026-08-19',
    title: 'We Health-Checked Every Seller in the x402 Bazaar. One in Four Can’t Take an Agent’s Money.',
    excerpt:
      'One probe per seller, all 1,225 of them: 74% pass, 206 are dead at their listed URL, 40 are serving their paid product for free without knowing it, and 15% already answer with both x402 and MPP challenges. The first health census of the agent economy — plus the measurement mistake we made on the way that explains half the problem.',
  },
  {
    slug: 'stripe-openrouter-genius-act-agent-payment-rules',
    date: '2026-08-18',
    title: 'Three Different People Just Started Writing the Rules for How Agents Pay',
    excerpt:
      'In one week: Stripe reportedly bought OpenRouter for $7B+, Google’s AP2 protocol moved to FIDO Alliance governance, and Treasury published the GENIUS Act stablecoin licensing rules in the Federal Register. What each rulebook means for x402 and MPP sellers — and the first 24-hour read on the MPP rail since the acquisition news broke.',
  },
  {
    slug: 'x402-500-character-description-limit',
    date: '2026-08-04',
    title: 'The 500-Character Cliff: One Extra Byte Makes an x402 Listing Silently Unpayable',
    excerpt:
      'No error, no warning — a description one character over an undocumented limit makes an x402 resource silently unpurchasable. We measured the cliff at exactly 500 characters, credit the seller who filed the public report, and show the defense we run across 800+ listings. The upstream fix still hasn’t merged.',
  },
  {
    slug: 'x402-catalog-purge-overnight-july-2026',
    date: '2026-08-04',
    title: '43% of the x402 Catalog Vanished Overnight. Nobody Announced It.',
    excerpt:
      'Six days after we published the 40% whale, it was deleted — along with 10,700 other listings — between two of our crawler snapshots. The story of the silent late-July purge, the ground shifting under x402 sellers, our own zero-sale weekend, and the two new buyer wallets that showed up twelve hours after we fixed what nobody could see.',
  },
  {
    slug: 'open-usd-circle-stablecoin-x402',
    date: '2026-07-18',
    title: 'Open USD Blindsided Circle — and Previewed the Fight Over Agent Money',
    excerpt:
      'On June 30, 140+ companies — Stripe, Visa, Mastercard, BlackRock, and Circle’s own partner Coinbase — launched a stablecoin that gives reserve yield back to participants. CRCL fell 17%. Why the attack is on the business model, not the token, and what it means for x402, where USDC settles ~98% of agent payments.',
  },
  {
    slug: 'why-ai-agents-need-crypto',
    date: '2026-07-18',
    title: 'AI × Blockchain Never Made Sense at Conferences. Then Agents Needed Wallets.',
    excerpt:
      'For years every conference coupled AI to crypto and none of it was coherent — models on-chain, tokens for compute. The real convergence came from the opposite direction: agents became economic actors and needed money without a human in the loop. That was crypto’s actual product all along.',
  },
  {
    slug: 'x402-bazaar-economy-data-july-2026',
    date: '2026-07-18',
    title: 'The x402 Economy, Measured: One Seller Is 40% of the Catalog',
    excerpt:
      'Original data from our Bazaar crawler: 24,816 live paid resources, 1,136 sellers (+3% in three days), 98% on Base, two-thirds priced between $0.01–$0.10 — and a single wallet behind 40% of all listings. Honest measurements of a very young market.',
  },
  {
    slug: 'lessons-from-500-paid-x402-endpoints',
    date: '2026-07-18',
    title: 'Five Lessons From Running 500+ Paid x402 Endpoints',
    excerpt:
      'Upstream APIs will rug-pull you mid-build. An empty 402 body is a lost sale. Never charge a buyer for your own errors. Field notes on what selling to AI agents actually looks like, from the operators of 11 live x402 services and counting.',
  },
  {
    slug: 'x402-foundation-linux-foundation-launch',
    date: '2026-07-18',
    title: 'The Linux Foundation Now Governs x402 — and Visa, Mastercard, and Stripe Just Joined',
    excerpt:
      'On July 14, 2026 the x402 Foundation went operational under Linux Foundation governance with 40 members spanning card networks, clouds, and crypto. Here is what actually changed, why the membership list matters more than the press release, and what it means if you sell — or plan to sell — to AI agents.',
  },
];

export default function BlogIndex() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-16 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                ForgeMesh blog
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              Notes from the machine economy
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              We operate 11 x402 services and counting, with 500+ paid endpoints, and crawl the discovery ecosystem
              three times a day. This is where we publish what we learn — protocol news, original
              data, and operator field notes.
            </p>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-16">
          <div className="mx-auto max-w-4xl space-y-6">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block rounded border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-blue-500/40 hover:bg-blue-500/[0.04]"
              >
                <time dateTime={post.date} className="font-mono text-xs text-blue-300/80">
                  {post.date}
                </time>
                <h2 className="mt-2 text-xl font-semibold leading-snug text-slate-100 sm:text-2xl">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{post.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-400">
                  Read the analysis <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </a>
            ))}
            <p className="pt-4 text-sm leading-6 text-slate-500">
              Start with the fundamentals:{' '}
              <a href="/x402" className="text-blue-400 hover:text-blue-300">What is x402?</a> ·{' '}
              <a href="/402-payment-required" className="text-blue-400 hover:text-blue-300">
                The 30-year history of HTTP 402
              </a>
            </p>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
