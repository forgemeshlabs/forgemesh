import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BlogArchive } from '@/components/BlogArchive';

const SLUG = 'x401-identity-protocol-agent-economy';
const PUBLISHED = '2026-08-22';
const TITLE = '401 Asks Who You Are. 402 Asks You to Pay. The Agent Web Just Got Both.';
const DESCRIPTION =
  "Proof's x401 protocol — backed by Circle, OpenAI, Google, and Okta — gives every website a standard way to ask which human is behind an AI agent, using the HTTP status code that sat next to 402 for thirty years. What it is in plain language, why sellers in the agent economy should care, and the honest caveats.";
const HERO = `/blog/${SLUG}.png`;
const TAGS = ['protocol', 'identity', 'x401', 'news'];

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: `${TITLE} | ForgeMesh Labs`,
  description: DESCRIPTION,
  keywords: [...TAGS, 'verifiable credentials', 'x402', 'agent payments', 'AI agent identity', 'USDC micropayments', 'Base mainnet'],
  alternates: { canonical: `/blog/${SLUG}` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: `https://forgemesh.io/blog/${SLUG}`,
    publishedTime: PUBLISHED,
    modifiedTime: PUBLISHED,
    authors: ['ForgeMesh Labs'],
    tags: TAGS,
    images: [HERO],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: [HERO],
    title: 'The agent web just got its second handshake',
    description:
      "x402 answers how an agent pays. Proof's new x401 — backed by Circle, OpenAI, Google, and Okta — answers who it is. What the missing identity layer means for everyone selling to machines.",
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      author: {
        '@type': 'Organization',
        name: 'ForgeMesh Labs',
        url: 'https://forgemesh.io',
        description: 'Operators of a fleet of paid x402 and MPP services with 800+ indexed resources.',
      },
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      keywords: TAGS.join(', '),
      image: `https://forgemesh.io${HERO}`,
      mainEntityOfPage: `https://forgemesh.io/blog/${SLUG}`,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://forgemesh.io/blog' },
        { '@type': 'ListItem', position: 3, name: 'x401 and the identity layer', item: `https://forgemesh.io/blog/${SLUG}` },
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
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-8 xl:gap-12">
            <div className="min-w-0 max-w-3xl lg:flex-1">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
                <ForgeMeshMark size={22} className="shrink-0" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                  Protocol watch · <time dateTime={PUBLISHED}>{PUBLISHED}</time>
                </span>
              </div>

              <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
                401 asks who you are. 402 asks you to pay. The agent web just got both.
              </h1>

              <img
                src={HERO}
                alt="Two interlocked glowing rings, one carrying an identity mark and one carrying a coin, joined like a handshake"
                className="mt-8 w-full rounded border border-white/[0.06]"
                width={1200}
                height={675}
              />

              <ShareBar inline />

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Since 1997, HTTP has carried two status codes that sat side by side doing almost
                nothing: <strong className="text-slate-100">401 Unauthorized</strong> — &ldquo;tell
                me who you are&rdquo; — and <strong className="text-slate-100">402 Payment
                Required</strong> — &ldquo;pay me.&rdquo; We&rsquo;ve spent the past year building a
                business on the second one: our fleet answers hundreds of thousands of 402
                challenges a month, selling data to AI agents for USDC micropayments. This summer,
                the first one finally got its job. Proof&rsquo;s{' '}
                <a href="https://www.proof.com/x401" className="text-blue-400 hover:text-blue-300" rel="noopener noreferrer" target="_blank">
                  x401 protocol
                </a>{' '}
                — launched June 25 with backing from Circle, OpenAI, Google, and Okta — gives every
                website and API a standard way to ask the question the agent economy has been
                dodging: <em>which human is actually behind this agent?</em>
              </p>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                What x401 actually is, in plain language
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                Today, when an AI agent shows up at a paid endpoint, the seller knows exactly one
                thing about it: whether its money is good. That&rsquo;s what x402 proves, and for a
                $0.001 weather lookup it&rsquo;s plenty. But the moment an agent wants to do
                something that matters — sign a contract, access age-restricted data, spend real
                money on someone&rsquo;s behalf — &ldquo;the money is good&rdquo; stops being
                enough. x401 lets the service respond the way a bouncer would: prove it. The agent
                answers with a cryptographically signed credential — a Verifiable Credential, the
                same W3C standard behind digital driver&rsquo;s licenses — attesting to exactly the
                claim requested: verified identity, age, company affiliation, signing authority, or
                simply &ldquo;a real human authorized this.&rdquo;
              </p>
              <p className="mt-4 text-base leading-8 text-slate-400">
                The clever part is what it <em>doesn&rsquo;t</em> reveal. Selective disclosure and
                zero-knowledge proofs mean the agent can prove &ldquo;my principal is over 18&rdquo;
                or &ldquo;my principal is an employee of X&rdquo; without handing over a name, a
                birthdate, or a passport scan. The service verifies the issuer and the claim, not
                the person&rsquo;s whole identity. Circle&rsquo;s VP of Product put the pairing in
                one sentence: &ldquo;x402 answers how an agent pays, x401 answers who it is.&rdquo;
              </p>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                Why sellers in this economy should care
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  {
                    n: 'It unlocks the expensive endpoints',
                    d: 'Nobody needs identity to sell a $0.005 timezone lookup. But the endpoints the agent economy keeps NOT building — legal research, medical data, financial actions, anything regulated — are stuck precisely because sellers can’t know who’s buying. A standard way to require "verified human, verified org, verified authority" is the unlock for everything above the micropayment tier.',
                  },
                  {
                    n: 'It’s an anti-fraud layer we felt the need for this week',
                    d: 'Days ago we documented an address-poisoning attack on our own fleet — possible because on-chain, a wallet is just 40 anonymous characters. An identity layer that binds "this wallet acts for this verified principal" makes impersonation-by-lookalike dramatically harder. Payments without identity is exactly the gap that attack lives in.',
                  },
                  {
                    n: 'The backers are the tell',
                    d: 'Circle settles nearly all x402 volume; OpenAI and Google own the agents; Okta owns enterprise identity. The same institutional crowd that joined the x402 Foundation in July is assembling around the identity half. Proof says it will submit x401 to the FIDO Alliance’s agentic-authentication workgroup — the same body that took over Google’s AP2. The standards are consolidating fast.',
                  },
                ].map((b) => (
                  <div key={b.n} className="rounded border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="text-base font-semibold text-blue-300">{b.n}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{b.d}</p>
                  </div>
                ))}
              </div>

              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
                The honest caveats
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                x401 launched with a spec, docs, sample apps, and one live implementation —
                Proof&rsquo;s own digital ID. That&rsquo;s a real start, not an ecosystem.
                &ldquo;Issuer-neutral&rdquo; is the promise, but today the flagship issuer is the
                company that wrote the protocol, and the value of any identity network is exactly as
                large as its slowest-moving verifier. We&rsquo;ve also watched this movie before:
                x402 taught us that a protocol can be institutionally blessed and still have{' '}
                <a href="/blog/x402-bazaar-health-census-august-2026" className="text-blue-400 hover:text-blue-300">
                  a quarter of its sellers unable to take a payment
                </a>
                . Standards announcements are the easy part; interop is where economies are actually
                built — or quietly lost.
              </p>
              <p className="mt-4 text-base leading-8 text-slate-400">
                Our plan: we&rsquo;ll prototype an x401 challenge on one of our own gated endpoints
                the same way we dogfood everything else — pay it, probe it, break it, and publish
                what we find. If the agent web is getting a second handshake, we want field notes
                from the first grip.
              </p>

              <ShareBar inline />

              <div className="mt-12 rounded border border-blue-500/25 bg-blue-500/[0.06] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                  Selling to agents?
                </p>
                <p className="mt-3 text-base leading-7 text-slate-300">
                  We run 500+ paid endpoints and publish everything we learn — including the
                  incidents. The free scan checks whether stock agent clients can actually pay your
                  endpoint today, on the rail that already works.
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
                <a href="/blog/stripe-openrouter-genius-act-agent-payment-rules" className="text-blue-400 hover:text-blue-300">
                  the three rulebooks being written for how agents pay
                </a>{' '}
                and{' '}
                <a href="/blog/address-poisoning-dust-attack-x402-agent-wallets" className="text-blue-400 hover:text-blue-300">
                  the wallet-impersonation attack that identity would have blunted
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
            <BlogArchive current={SLUG} />
          </div>
        </article>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
