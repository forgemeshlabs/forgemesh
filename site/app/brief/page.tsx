import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { BriefArchive } from '@/components/BriefArchive';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'The ForgeMesh Brief — x402 Intel, Only When It Matters | ForgeMesh Labs',
  description:
    'An event-driven brief for x402 sellers and agent-economy builders. No weekly filler: we email when the ecosystem actually moves — catalog purges, silent API changes, undocumented limits — usually before anyone announces it. Sourced from monitoring that watches 800+ of our own listings.',
  alternates: { canonical: '/brief' },
  openGraph: {
    title: 'The ForgeMesh Brief — x402 intel, only when it matters',
    description:
      'We email when the x402 ecosystem actually moves. Our monitoring usually notices before anyone announces it.',
    type: 'website',
    url: 'https://forgemesh.io/brief',
    images: ['/fm-nobg.png'],
  },
};

const receipts = [
  {
    title: 'The overnight purge',
    detail:
      '43% of the x402 catalog deleted between two of our snapshots — never announced. Our crawler timestamps are the public record.',
    href: '/blog/x402-catalog-purge-overnight-july-2026',
  },
  {
    title: 'The 500-character cliff',
    detail:
      'A description one character too long makes a listing silently unpayable. We measured the exact limit; the upstream fix still hasn’t merged.',
    href: '/blog/x402-500-character-description-limit',
  },
  {
    title: 'The quiet API changes',
    detail:
      'The endpoint sellers used to verify their listings silently changed behavior. If your check still “passes,” it may be checking nothing.',
    href: '/blog/x402-catalog-purge-overnight-july-2026',
  },
];

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                The ForgeMesh Brief
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              The agent economy changes without press releases. We email you when it does.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              No weekly filler, no roundups of other people&apos;s tweets. The Brief goes out when
              something in the x402 ecosystem actually moves — a purge, a silently changed API, an
              undocumented limit that eats sales — sourced from monitoring that watches our own
              800+ paid listings around the clock. If we email you, it&apos;s because it matters.
            </p>

            <form
              method="POST"
              action="https://kit.forgemesh.io/subscribe"
              className="mt-8 flex max-w-md gap-2"
            >
              <input type="hidden" name="source" value="brief" />
              <input
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                aria-label="Email address"
                className="w-full min-w-0 rounded border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Subscribe <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </form>
            <p className="mt-3 text-xs text-slate-600">
              Free. Unsubscribe anytime. You&apos;ll also get our x402 idea-fit checklist as a
              welcome gift.
            </p>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-slate-50">
              The kind of thing you&apos;ll hear about first
            </h2>
            <div className="mt-6 space-y-4">
              {receipts.map((r) => (
                <a
                  key={r.title}
                  href={r.href}
                  className="block rounded border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-blue-500/30 hover:bg-white/[0.04]"
                >
                  <p className="text-sm font-medium text-slate-200">{r.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{r.detail}</p>
                </a>
              ))}
            </div>

            <BriefArchive />

            <p className="mt-10 text-base leading-8 text-slate-400">
              Who writes this: the operators of 13 live x402 services — market intelligence, voice,
              a 415-route utility grid, a knowledge library, an agent-buyable storefront. The Brief
              is the same intel stream we run our own fleet on, minus the parts that are{' '}
              <a href="https://kit.forgemesh.io" className="text-blue-400 hover:text-blue-300">
                in the paid kits
              </a>
              .
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
