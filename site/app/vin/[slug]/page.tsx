// Programmatic SEO page — "<year> <make> <model> problems" — the traffic
// engine for the free VIN checker (/vin) and the EpicVIN affiliate CTA.
// Data comes from public/vin-problems/<slug>.json, written by
// scripts/vin-problems.js from NHTSA complaints + recalls (cron'd weekly).
// Rendered per-request (force-dynamic) so a data refresh needs no rebuild.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AlertTriangle, ArrowRight, Flame, ShieldAlert } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { loadVinProblemsIndex, loadVinProblemsSlug } from '@/lib/vin-problems';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

const title = (s: string) => s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
const prettyComponent = (s: string) => title(s.replace(/:/g, ' › '));

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const data = loadVinProblemsSlug(slug);
  if (!data) return {};
  const { year, make, model } = data;
  const name = `${year} ${make} ${model}`;
  const shortTitle = truncate(`${name} Problems | ForgeMesh`, 60);
  const description = truncate(
    `Every NHTSA complaint and recall on file for the ${name}: top failing components ranked by share, do-not-drive recalls, and real owner reports. Free, official data.`,
    155,
  );
  return {
    metadataBase: new URL('https://forgemesh.io'),
    title: shortTitle,
    description,
    keywords: [`${name} problems`, `${name} reliability`, `${name} recalls`, `${name} complaints`, `is the ${name} reliable`],
    alternates: { canonical: `/vin/${slug}` },
    openGraph: { title: `${name} Problems`, description, type: 'article', url: `https://forgemesh.io/vin/${slug}` },
    twitter: { card: 'summary_large_image', site: '@forgemeshlabs', title: `${name} Problems`, description },
  };
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${accent || 'text-slate-100'}`}>{value}</p>
    </div>
  );
}

export default async function VinProblemsPage({ params }: Params) {
  const { slug } = await params;
  const data = loadVinProblemsSlug(slug);
  if (!data) notFound();

  const { year, make, model, failures, recalls } = data;
  const name = `${year} ${make} ${model}`;
  const index = loadVinProblemsIndex();

  const sameModel = index.filter((e) => e.make === make && e.model === model).sort((a, b) => a.year - b.year);
  const pos = sameModel.findIndex((e) => e.slug === slug);
  const prevYear = pos > 0 ? sameModel[pos - 1] : null;
  const nextYear = pos >= 0 && pos < sameModel.length - 1 ? sameModel[pos + 1] : null;
  const otherModels = [...new Map(index.filter((e) => e.make === make && e.model !== model).map((e) => [e.model, e])).values()].slice(0, 8);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: `${name} Problems: Top Complaints, Recalls & Failures (NHTSA)`,
        description: `Ranked NHTSA complaint and recall data for the ${name}.`,
        datePublished: data.generated,
        dateModified: data.generated,
        author: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
        publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
        mainEntityOfPage: `https://forgemesh.io/vin/${slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
          { '@type': 'ListItem', position: 2, name: 'Free VIN Check', item: 'https://forgemesh.io/vin' },
          { '@type': 'ListItem', position: 3, name: 'Common Problems', item: 'https://forgemesh.io/vin/problems' },
          { '@type': 'ListItem', position: 4, name: `${name} Problems`, item: `https://forgemesh.io/vin/${slug}` },
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
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <a href="/vin" className="hover:text-slate-300">Free VIN check</a>
              <span>/</span>
              <a href="/vin/problems" className="hover:text-slate-300">Common problems</a>
              <span>/</span>
              <span className="text-slate-400">{name}</span>
            </div>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">NHTSA data · free</span>
            </div>
            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              {name} Problems: Top Complaints, Recalls &amp; Failures (NHTSA)
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Every owner complaint and safety recall the National Highway Traffic Safety
              Administration has on file for the {name}, ranked by the component that failed most.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Complaints on file" value={failures.total_complaints.toLocaleString()} />
              <StatCard label="Recalls issued" value={recalls.count} accent={recalls.count ? 'text-amber-300' : undefined} />
              <StatCard label="Crashes reported" value={failures.severity.crashes} accent={failures.severity.crashes ? 'text-rose-300' : undefined} />
              <StatCard label="Fires reported" value={failures.severity.fires} accent={failures.severity.fires ? 'text-rose-300' : undefined} />
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">What breaks most</h2>
            {failures.top_failure_components.length ? (
              <ul className="mt-6 space-y-4">
                {failures.top_failure_components.map((c) => (
                  <li key={c.component} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-100">{prettyComponent(c.component)}</span>
                      <span className="font-mono text-xs text-slate-400">{c.complaints.toLocaleString()} complaints · {c.share_pct}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full bg-blue-500/70" style={{ width: `${Math.min(100, c.share_pct)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-400">
                No consumer complaints on file for the {name} — a real answer, not a data gap.
              </p>
            )}
            {data.matched_as.complaints ? (
              <p className="mt-4 text-xs leading-6 text-slate-500">
                NHTSA files this model under: {data.matched_as.complaints.join(', ')}.
              </p>
            ) : null}
          </div>
        </section>

        {recalls.count ? (
          <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Recalls on this model year</h2>
              <ul className="mt-6 divide-y divide-white/[0.06]">
                {recalls.recalls.map((r) => (
                  <li key={r.campaign_number} className="py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {r.park_it ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-300">
                          <ShieldAlert className="h-3 w-3" aria-hidden /> Do not drive
                        </span>
                      ) : null}
                      {r.park_outside ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-orange-300">
                          <Flame className="h-3 w-3" aria-hidden /> Park outside
                        </span>
                      ) : null}
                      <span className="text-sm font-medium text-slate-100">{prettyComponent(r.component)}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{r.summary}</p>
                    <p className="mt-2 font-mono text-[11px] text-slate-600">
                      Campaign {r.campaign_number} · reported {r.report_date} · recall work is free at any franchised dealer
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">What owners report</h2>
            {failures.top_failure_components.some((c) => c.excerpts.length) ? (
              <div className="mt-6 space-y-5">
                {failures.top_failure_components
                  .filter((c) => c.excerpts.length)
                  .map((c) => (
                    <div key={c.component}>
                      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">{prettyComponent(c.component)}</p>
                      <ul className="mt-2 space-y-2">
                        {c.excerpts.map((e, i) => (
                          <li key={i} className="flex gap-2 rounded-lg border border-white/[0.05] bg-white/[0.015] p-3 text-sm leading-6 text-slate-400">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" aria-hidden />
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-400">No excerptable complaint text on file.</p>
            )}
            <p className="mt-6 text-xs leading-6 text-slate-500">
              Excerpts are anonymized owner complaints as filed with NHTSA, trimmed to 200 characters.
            </p>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Check your own VIN</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              This page covers the {name} in general. Enter your VIN for the recalls, complaints and
              crash ratings specific to your exact vehicle.
            </p>
            <form action="/vin" method="get" className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="vin"
                maxLength={17}
                placeholder="Enter your 17-character VIN"
                className="w-full rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-3 font-mono text-sm uppercase tracking-wider text-slate-100 placeholder:text-slate-600 placeholder:normal-case placeholder:tracking-normal focus:border-blue-400/60 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg border border-blue-500/40 bg-blue-500/10 px-6 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Check VIN
              </button>
            </form>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-blue-500/25 bg-blue-500/[0.06] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Buying a used {name}?</p>
              <p className="mt-3 text-base leading-7 text-slate-300">
                A full vehicle history report checks title brands, accident records, and odometer
                readings for the specific VIN — none of which government complaint or recall data
                covers.
              </p>
              <a
                href="/go/epicvin"
                data-umami-event="affiliate_click"
                data-umami-event-partner="epicvin"
                data-umami-event-slot="problems-page"
                className="mt-4 inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Run a vehicle history report <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl grid gap-8 sm:grid-cols-2">
            {(prevYear || nextYear) && (
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Other model years</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {prevYear ? <li><a href={`/vin/${prevYear.slug}`} className="text-blue-400 hover:text-blue-300">{prevYear.year} {make} {model} problems</a></li> : null}
                  {nextYear ? <li><a href={`/vin/${nextYear.slug}`} className="text-blue-400 hover:text-blue-300">{nextYear.year} {make} {model} problems</a></li> : null}
                </ul>
              </div>
            )}
            {otherModels.length ? (
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">More {make} models</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {otherModels.map((m) => (
                    <li key={m.slug}><a href={`/vin/${m.slug}`} className="text-blue-400 hover:text-blue-300">{m.year} {m.make} {m.model} problems</a></li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <a href="/vin/problems" className="text-sm text-blue-400 hover:text-blue-300">← Browse all models</a>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs leading-6 text-slate-500">
              Disclosure: some links on this page (vehicle history reports, warranty options) are
              affiliate links. They fund the free checker, and your price never changes. Recall,
              complaint, rating and fuel-economy data are official U.S. government records for the
              year, make and model and are not a substitute for an inspection or a title history
              report on the specific vehicle. Not affiliated with any government agency.
            </p>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
