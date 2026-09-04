// Free VIN checker for humans — the funnel mouth for the paid Vehicle
// Intelligence Pack (/vehicle-intelligence). Same government data our x402
// endpoints serve to agents, given to used-car shoppers free. Data plumbing:
// lib/vin-report.ts → /api/vin-report (free gov upstreams, never our paid
// endpoints). Monetization slots: /go/<partner> affiliate stubs, warranty
// slot, recall-alert email capture (/api/vin-alerts).
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { VinChecker } from '@/components/VinChecker';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Free VIN Check: Recalls, Common Problems, Crash Ratings | ForgeMesh',
  description:
    'Free VIN decoder and recall lookup. Enter any VIN for the decoded vehicle, open safety recalls, crash-test stars, official fuel economy, and a ranked list of what actually breaks on that car — from official U.S. government safety data. No signup.',
  keywords: [
    'free vin check', 'vin decoder', 'vin lookup', 'vin recall lookup', 'check vin for recalls',
    'common problems by vin', 'car reliability by vin', 'vin number check free', 'decode vin',
    'crash test ratings by vin', 'used car check', 'what to check before buying a used car',
  ],
  alternates: { canonical: '/vin' },
  openGraph: {
    title: 'Free VIN Check — Recalls, What Breaks, Crash Ratings',
    description:
      'Enter any VIN: decoded vehicle, open recalls with do-not-drive flags, crash-test stars, fuel costs, and the ranked list of what actually breaks on that car. Free, official U.S. government data, no signup.',
    type: 'website',
    url: 'https://forgemesh.io/vin',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    title: 'Free VIN Check — Recalls, What Breaks, Crash Ratings',
    description:
      'Decoded vehicle, open recalls, crash-test stars, fuel costs, and what actually breaks on that car. Free, official U.S. government data, no signup.',
  },
};

const faq = [
  {
    q: 'What does a free VIN check actually tell me?',
    a: 'This page decodes the VIN into year, make, model, trim, engine, transmission and assembly plant, then pulls every open safety recall for that year/make/model, government crash-test star ratings, official fuel economy and annual fuel cost, and a ranked breakdown of the owner defect complaints on file — which components fail most, and how many of those complaints involved a crash, fire, injury or death.',
  },
  {
    q: 'Is this a vehicle history report?',
    a: 'No. Title brands, accident records, odometer readings and ownership history come from licensed title databases and are sold per VIN by history-report companies. This page covers what official government safety and fuel-economy data knows about the year, make and model. Use both before buying a used car: this one first, because it is free.',
  },
  {
    q: 'Where does the data come from?',
    a: 'Official U.S. government sources: the federal vehicle identification decoder, the national safety recall and consumer complaint databases, the government 5-star crash-test program, and the federal fuel-economy database. All public-domain, fetched live and cached for 30 minutes. No third-party data vendor in between.',
  },
  {
    q: 'Why does my VIN show zero recalls or zero complaints?',
    a: 'Zero is a real answer. Recalls and complaints are filed against a year, make and model — a rare, very new, or simply reliable vehicle can legitimately have none. Sign up for recall alerts and we will email you if that changes.',
  },
  {
    q: 'How do I read a VIN myself?',
    a: 'Every vehicle sold since 1981 carries a 17-character VIN. Position 1 is the build country (J is Japan, 1/4/5 the United States, 2 Canada, 3 Mexico, W Germany, K South Korea), positions 2–3 the manufacturer, 4–8 the model and body encoded in the maker\'s own scheme, position 9 a check digit that catches typos, position 10 the model year, position 11 the assembly plant, and 12–17 the serial number. The letters I, O and Q never appear.',
  },
  {
    q: 'Where do I find the VIN on my car?',
    a: 'On a plate at the base of the windshield on the driver side (visible from outside), on the sticker inside the driver door jamb, on the title and registration, and on your insurance card. Photograph the door-jamb sticker — it is the easiest to read and includes the build date.',
  },
  {
    q: 'Can I get this data as an API for my app or AI agent?',
    a: 'Yes. The same six lookups are available pay-per-call to software and AI agents through the Vehicle Intelligence Pack at forgemesh.io/vehicle-intelligence — from half a cent per call, no account or API key, paid in USDC over x402 or MPP.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'ForgeMesh Free VIN Check',
      url: 'https://forgemesh.io/vin',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'Free VIN decoder and recall lookup: decoded vehicle, open safety recalls with do-not-drive flags, crash-test ratings, fuel economy, and a ranked list of the most-reported failing components, all from official U.S. government data.',
      featureList: [
        'VIN decode (year, make, model, trim, engine, transmission, assembly plant)',
        'Open safety recalls with do-not-drive and park-outside flags',
        'Government 5-star crash-test ratings',
        'Ranked most-reported failing components with crash/fire/injury totals',
        'Official fuel economy and annual fuel cost',
        'Free recall alerts by email',
      ],
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Free VIN Check', item: 'https://forgemesh.io/vin' },
      ],
    },
  ],
};

export default function VinPage() {
  return (
    <>
      <NavBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-4 pb-14 pt-28 sm:px-6 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.18),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(245,158,11,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Free VIN check · no signup
              </span>
            </div>
            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              Check any VIN. See what actually breaks on that car.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              Decoded vehicle, open safety recalls with do-not-drive flags, crash-test stars, fuel
              costs — and the part most VIN checkers skip: every owner complaint on file, ranked by
              the component that failed. Official U.S. government safety data, free.
            </p>

            <div className="mt-8">
              <VinChecker />
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">What you get, in one lookup</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ['Decoded vehicle', 'Year, make, model, trim, engine, transmission, drivetrain and the plant it was assembled in — with the check digit verified so a typo can\'t fool you.'],
                ['Open safety recalls', 'Every recall campaign for that year/make/model, do-not-drive and park-outside fire-risk campaigns pinned to the top. Recall repairs are free at any franchised dealer.'],
                ['What actually breaks', 'Every owner defect complaint on file, aggregated into a ranked table of failing components with the share of complaints each one accounts for, plus crash, fire, injury and death totals.'],
                ['Crash tests and fuel', 'Government 5-star crash-test ratings for the tested variant closest to your car, plus official city/highway MPG and the estimated annual fuel bill.'],
              ].map(([h, p]) => (
                <div key={h} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-medium text-slate-100">{h}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">FAQ</h2>
            <dl className="mt-6 space-y-7">
              {faq.map((f) => (
                <div key={f.q}>
                  <dt className="font-medium text-slate-100">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-7 text-slate-400">{f.a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-sm leading-7 text-slate-400">
              Want the character-by-character version? Read{' '}
              <a href="/blog/how-to-read-a-vin" className="text-blue-400 hover:text-blue-300">
                how to read a VIN
              </a>{' '}
              — why a J really does mean Japan, and where eyeballing goes wrong.
            </p>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-blue-500/25 bg-blue-500/[0.06] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Developers</p>
              <p className="mt-3 text-base leading-7 text-slate-300">
                This data as an API: the same six lookups — decode, recalls, ratings, complaints,
                failure report, fuel economy — served pay-per-call to apps and AI agents, from half a
                cent per call with no account or API key.
              </p>
              <a
                href="/vehicle-intelligence"
                className="mt-4 inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Vehicle Intelligence Pack <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <p className="mt-8 text-xs leading-6 text-slate-500">
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
