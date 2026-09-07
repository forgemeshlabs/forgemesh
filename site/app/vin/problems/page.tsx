// Hub page for the VIN Problems programmatic SEO set — lists every
// <year> <make> <model> problems page, grouped by make. Linked from /vin
// and lib/tools-catalog.ts. Reads public/vin-problems/index.json at request
// time (written by scripts/vin-problems.js) so new slugs show up without a
// rebuild.
import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { loadVinProblemsIndex } from '@/lib/vin-problems';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Common Car Problems by Model — NHTSA Complaints & Recalls | ForgeMesh',
  description:
    'Browse NHTSA complaint and recall data for 60+ popular used-car models, 2008-2022. Top failing components, do-not-drive recalls, and real owner reports, free.',
  alternates: { canonical: '/vin/problems' },
  openGraph: {
    title: 'Common Car Problems by Model — NHTSA Data',
    description: 'NHTSA complaints and recalls for 60+ used-car models, ranked by what actually breaks. Free.',
    type: 'website',
    url: 'https://forgemesh.io/vin/problems',
  },
};

export default function VinProblemsHub() {
  const entries = loadVinProblemsIndex();

  const byMake = new Map<string, typeof entries>();
  for (const e of entries) {
    if (!byMake.has(e.make)) byMake.set(e.make, []);
    byMake.get(e.make)!.push(e);
  }
  for (const list of byMake.values()) list.sort((a, b) => a.model.localeCompare(b.model) || b.year - a.year);
  const makes = [...byMake.keys()].sort();

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
          { '@type': 'ListItem', position: 2, name: 'Free VIN Check', item: 'https://forgemesh.io/vin' },
          { '@type': 'ListItem', position: 3, name: 'Common Problems', item: 'https://forgemesh.io/vin/problems' },
        ],
      },
    ],
  };

  return (
    <>
      <NavBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-4 pb-10 pt-28 sm:px-6 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.18),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(245,158,11,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">NHTSA data · free</span>
            </div>
            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              Common problems by model
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              {entries.length.toLocaleString()} year/make/model pages built from official NHTSA
              complaint and recall data — what actually breaks, ranked by how often it's reported.
            </p>
            <p className="mt-4">
              <a href="/vin" className="text-sm text-blue-400 hover:text-blue-300">Have a VIN already? Check it directly →</a>
            </p>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-4xl space-y-10">
            {makes.length === 0 ? (
              <p className="text-sm text-slate-400">Data is being collected — check back shortly.</p>
            ) : (
              makes.map((make) => {
                const list = byMake.get(make)!;
                const byModel = new Map<string, typeof list>();
                for (const e of list) {
                  if (!byModel.has(e.model)) byModel.set(e.model, []);
                  byModel.get(e.model)!.push(e);
                }
                return (
                  <div key={make}>
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">{make}</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {[...byModel.entries()].map(([model, years]) => (
                        <div key={model} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                          <p className="text-sm font-medium text-slate-100">{model}</p>
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                            {years
                              .slice()
                              .sort((a, b) => b.year - a.year)
                              .map((e) => (
                                <a key={e.slug} href={`/vin/${e.slug}`} className="font-mono text-xs text-blue-400 hover:text-blue-300">
                                  {e.year}
                                </a>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
