import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'New Here? Start Here — Get Paid by AI Agents | ForgeMesh Labs',
  description:
    'New to x402 and agent payments? Pick your door: monetize a website with no code, make your API machine-payable, follow the rails with original data, or build alongside other people doing it. Plain-English starting points from operators of 17 live services.',
  keywords: [
    'x402 getting started', 'get paid by AI agents', 'monetize website AI agents', 'x402 tutorial',
    'agent payments beginner', 'sell to AI agents', 'x402 for creators', 'machine economy',
  ],
  alternates: { canonical: '/new-here' },
  openGraph: {
    title: 'New here? Four doors into the agent economy',
    description:
      'Monetize a website with no code, make your API machine-payable, follow the rails, or build with people. Starting points from operators of 17 live x402 services.',
    type: 'website',
    url: 'https://forgemesh.io/new-here',
    images: ['/fm-nobg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    images: ['/fm-nobg.png'],
    title: 'New to agent payments? Start here.',
    description: 'Four doors into the x402 economy — pick yours.',
  },
};

const doors = [
  {
    eyebrow: 'I have a website or content',
    title: 'Charge agents for it — without writing code',
    body:
      'AI agents already visit your site; right now they take everything for free. x402 Proxy puts a price on any URL you own: you set the amount, agents pay in USDC on Base automatically, you collect. No wallet knowledge, no code, self-serve.',
    cta: 'Set up x402 Proxy',
    href: 'https://proxy.forgemesh.io',
  },
  {
    eyebrow: 'I have an API or I build software',
    title: 'Make it machine-payable — then verify agents can actually pay it',
    body:
      'In our August census of all 1,225 sellers in the x402 catalog, one in four couldn’t complete a sale. Start with the free scanner to see what agents see, then use the seller kits to wire x402 (and MPP dual-stack) properly the first time.',
    cta: 'Scan an endpoint free',
    href: '/scan',
    secondary: { label: 'Get the seller kits', href: 'https://kit.forgemesh.io' },
  },
  {
    eyebrow: 'I’m watching this space',
    title: 'Follow the rails with measured numbers, not press releases',
    body:
      'We operate 17 paid services and crawl the discovery ecosystem three times a day, so our data is first-hand: the Rail Pulse ticker updates daily, the census lands monthly, and The Brief sends only when something actually moves.',
    cta: 'Subscribe to The Brief',
    href: '/brief',
    secondary: { label: 'Read the census', href: '/blog/x402-bazaar-health-census-august-2026' },
  },
  {
    eyebrow: 'I want to build with people',
    title: 'The builder community is warming back up',
    body:
      'Meetups, build nights, and a builders’ space are relaunching now that everyone’s back at their desks. Brief subscribers get the invite first — founding members ride free.',
    cta: 'Get the invite via The Brief',
    href: '/brief',
  },
];

export default function NewHerePage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-16 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Start here</span>
            </div>

            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-slate-50 sm:text-5xl">
              AI agents have money now.
              <br />
              Pick your door.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Agents pay for APIs, data, and content in USDC over open protocols — x402 and MPP — with no accounts and
              no invoices. We run 17 paid services on these rails and measure the whole ecosystem daily. Whatever
              brought you here, one of these four doors is yours.
            </p>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {doors.map((d) => (
                <div key={d.eyebrow} className="flex flex-col rounded border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-blue-500/30">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">{d.eyebrow}</p>
                  <h2 className="mt-3 text-xl font-semibold leading-snug text-slate-100">{d.title}</h2>
                  <p className="mt-3 grow text-sm leading-7 text-slate-400">{d.body}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={d.href}
                      className="inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
                    >
                      {d.cta} <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                    {d.secondary ? (
                      <a
                        href={d.secondary.href}
                        className="inline-flex items-center gap-2 rounded border border-white/[0.12] px-4 py-2.5 text-sm text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
                      >
                        {d.secondary.label}
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-12 text-sm leading-7 text-slate-500">
              Not sure which door? Start with{' '}
              <a href="/x402" className="text-blue-400 hover:text-blue-300">
                What is x402?
              </a>{' '}
              — five minutes, no jargon — then come back.
            </p>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
