import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { TxWatchList } from '@/components/TxWatch';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Texas Watch — Data Center, Fab & Grid Buildout | ForgeMesh Labs',
  description:
    'Auto-updated tracker of the physical buildout under the agent economy in Texas: data-center permits, fab construction, and grid interconnection news, refreshed several times a day by ForgeMesh.',
  keywords: [
    'Texas data centers', 'Texas fab construction', 'Texas grid interconnection',
    'data center permits Texas', 'AI infrastructure Texas', 'ForgeMesh Texas Watch',
  ],
  alternates: { canonical: '/texas' },
  openGraph: {
    title: 'Texas Watch — Data Center, Fab & Grid Buildout',
    description:
      'Auto-updated tracker of Texas data-center, fab, and grid buildout news, refreshed several times a day.',
    type: 'website',
    url: 'https://forgemesh.io/texas',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    title: 'Texas Watch — Data Center, Fab & Grid Buildout',
    description:
      'Auto-updated tracker of Texas data-center, fab, and grid buildout news, refreshed several times a day.',
  },
};

export default function TexasWatchPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                ForgeMesh Monitoring
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              Texas Watch
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              This tracks the physical buildout under the agent economy — data-center permits, fab
              construction, grid interconnection — auto-updated several times a day by
              ForgeMesh&apos;s monitoring.
            </p>

            <TxWatchList />
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
