import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { TxWatchList } from '@/components/TxWatch';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Texas Watch — Data Center, Fab & Grid Buildout | ForgeMesh Labs',
  description:
    'The move shows up in the permits before it shows up in the press release. Auto-updated tracker of the Texas buildout under the AI agent economy: data-center permits and zoning, semiconductor fab construction (Terafab), ERCOT interconnection filings, and local government moves in Conroe, Montgomery County, Abilene and beyond — refreshed several times a day.',
  keywords: [
    'Texas data centers', 'Texas data center permits', 'data center zoning Texas',
    'Terafab', 'Texas semiconductor fab construction', 'ERCOT interconnection queue',
    'ERCOT large load', 'Conroe data center regulations', 'Montgomery County data center',
    'Abilene data center', 'hyperscaler site selection Texas', 'AI infrastructure Texas',
    'AI agent economy infrastructure', 'ForgeMesh Texas Watch',
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
              Nobody announces a gigaproject first. The move shows up in paperwork long before the
              press release: a county road suddenly scheduled for widening, a water district
              signing a supply agreement ten times the town&apos;s usage, a substation filing
              landing in the ERCOT interconnection queue, a rezoning docket where an LLC
              nobody&apos;s heard of has quietly assembled 800 acres. By the time the ribbon gets
              cut, the signal is two years old.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              That&apos;s what this page watches. The autonomous-agent economy runs on physical
              things — land, power, water, silicon — and Texas is where they&apos;re being poured:
              data-center permits and zoning fights, semiconductor fab construction on the scale of
              Terafab, grid interconnection filings, and the city-council agendas in places like
              Conroe, Montgomery County, and Abilene where the preparations surface first.
              ForgeMesh&apos;s monitoring sweeps these signals several times a day. The headlines
              below are the tells.
            </p>

            <TxWatchList />
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
