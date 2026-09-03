import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Vehicle Intelligence Pack — VIN In, Everything Out | ForgeMesh Labs',
  description:
    'Six x402-paid endpoints for AI agents: VIN decode, safety recalls, crash-test ratings, consumer complaints, a ranked failure-pattern report, and fuel economy. All from official public-domain sources. From half a cent per call in USDC on Base.',
  keywords: [
    'VIN decode API', 'vehicle recalls API', 'car safety ratings API', 'vehicle complaints API',
    'car reliability report API', 'fuel economy API', 'x402 vehicle data', 'used car due diligence API',
    'pay per call vehicle API', 'USDC micropayments', 'Base mainnet',
  ],
  alternates: { canonical: '/vehicle-intelligence' },
  openGraph: {
    title: 'Vehicle Intelligence Pack — VIN In, Everything Out',
    description:
      'Six x402-paid endpoints for vehicle data: VIN decode, recalls, crash ratings, complaints, a ranked failure report, and fuel economy. From half a cent per call.',
    type: 'website',
    url: 'https://forgemesh.io/vehicle-intelligence',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    title: 'Vehicle Intelligence Pack — VIN In, Everything Out',
    description:
      'Six x402-paid endpoints for vehicle data: VIN decode, recalls, crash ratings, complaints, failure patterns, fuel economy. From half a cent per call in USDC on Base.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Vehicle Intelligence Pack',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      url: 'https://x402.forgemesh.io',
      description:
        'x402-paid vehicle data API pack: VIN decode, safety recalls, crash-test ratings, consumer complaints, a ranked failure-pattern report, and fuel economy — all from official public-domain sources. USDC per call on Base.',
      publisher: { '@type': 'Organization', name: 'ForgeMesh Labs', url: 'https://forgemesh.io' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Vehicle Intelligence Pack', item: 'https://forgemesh.io/vehicle-intelligence' },
      ],
    },
  ],
};

const routes = [
  { path: '/vin-decode', price: '$0.005', what: 'VIN → full specs: make, model, year, trim, engine, transmission, plant', aliases: '/decode-vin, /vin-lookup, /vin-decoder' },
  { path: '/vehicle-recalls', price: '$0.005', what: 'Official safety recalls by VIN or year/make/model, with park-it / park-outside fire-risk flags', aliases: '/car-recalls, /recalls-by-vin, /vehicle-recall-check' },
  { path: '/vehicle-safety-ratings', price: '$0.005', what: 'Government 5-star crash-test ratings — overall, front, side, rollover — plus safety features', aliases: '/car-safety-ratings, /crash-test-ratings, /vehicle-crash-ratings' },
  { path: '/vehicle-complaints', price: '$0.005', what: 'Consumer defect complaints, filterable by component', aliases: '/car-complaints, /vehicle-complaint-search, /car-problem-reports' },
  { path: '/vehicle-top-failures', price: '$0.01', what: 'The full complaint file ranked into "what actually breaks on this car" — component share % plus crash/fire/injury/death totals', aliases: '/car-reliability-report, /top-failure-components, /common-car-problems' },
  { path: '/vehicle-fuel-economy', price: '$0.005', what: 'Official MPG, annual fuel cost, and CO2 for 1984+ vehicles', aliases: '/car-mpg-lookup, /fuel-cost-lookup, /gas-mileage-lookup' },
];

export default function VehicleIntelligencePage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Live on Base mainnet · x402 + MPP
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl">
              Vehicle Intelligence Pack. One VIN in, the whole car&apos;s history out.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              The used-car due-diligence stack for agents. One VIN in —{' '}
              <strong className="text-slate-200">specs, recalls, crash ratings, real-world failure
              patterns, and running costs</strong>{' '}
              out. Six x402-paid endpoints, every one of them auto-identifying the vehicle from the
              VIN and chaining the decode server-side, so an agent never has to call two endpoints to
              get one answer.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              All data comes from official public-domain sources, fetched live with a 30-minute
              cache — always current, no licensing risk. Built for car-shopping agents, marketplace
              and listing-enrichment tools, insurance quoting, fleet software, and mechanic triage
              bots. From half a cent a call, in USDC on Base.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Six endpoints, half a cent to a cent
            </h2>
            <div className="mt-6 overflow-x-auto rounded border border-white/[0.06]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] font-mono text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Route</th>
                    <th className="px-4 py-3">What it answers</th>
                    <th className="px-4 py-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((r) => (
                    <tr key={r.path} className="border-b border-white/[0.04] last:border-0 align-top">
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[13px] text-blue-200">
                        <span className="mr-2 text-slate-500">POST</span>
                        {r.path}
                      </td>
                      <td className="px-4 py-2.5 text-slate-400">
                        {r.what}
                        <div className="mt-1 font-mono text-[11px] text-slate-600">aliases: {r.aliases}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono text-slate-200">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Try it: the payment, VIN to what actually breaks
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-blue-200">/vehicle-top-failures</code>{' '}
              is the headliner: it aggregates the full complaint file into a ranked report of what
              actually breaks on that car. Here it is against a real VIN, unpaid first, then paid:
            </p>
            <pre className="mt-6 overflow-x-auto rounded border border-white/[0.08] bg-black/40 p-5 font-mono text-xs leading-6 text-slate-300">
{`curl -X POST https://x402.forgemesh.io/vehicle-top-failures \\
  -H 'Content-Type: application/json' \\
  -d '{"vin":"1HGCM82633A004352"}'

# → HTTP 402 Payment Required
# → PAYMENT-REQUIRED header (x402) or WWW-Authenticate: Payment (MPP)
# → price $0.01, network base, asset USDC, worked example, input schema

# agent constructs the payment from the challenge, settles in USDC on Base,
# and retries the same request with payment credentials attached

curl -X POST https://x402.forgemesh.io/vehicle-top-failures \\
  -H 'Content-Type: application/json' \\
  -H 'X-PAYMENT: <settled payment payload>' \\
  -d '{"vin":"1HGCM82633A004352"}'

# → HTTP 200 OK
# → 2003 Honda Accord — 2,013 complaints on file
# → POWER TRAIN 46% · AIR BAGS 16.1% · SERVICE BRAKES 8.7%
# → crash / fire / injury / death totals by component`}
            </pre>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Every route answers the same 402 challenge in both x402 and Stripe&apos;s{' '}
              <a href="/mpp" className="text-blue-400 hover:text-blue-300">MPP</a> format on the same
              response — one endpoint, two payment rails, no separate integration for either agent
              stack.
            </p>

            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-50">
              Part of the Utility Grid
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              These six routes live on the{' '}
              <a href="https://x402.forgemesh.io" className="text-blue-400 hover:text-blue-300">
                ForgeMesh Utility Grid
              </a>{' '}
              alongside dozens of other paid utilities. The open-source MCP server{' '}
              <a
                href="https://www.npmjs.com/package/@forgemeshlabs/utility-grid-mcp"
                className="text-blue-400 hover:text-blue-300"
              >
                @forgemeshlabs/utility-grid-mcp
              </a>{' '}
              exposes all grid routes as agent tools. Without a wallet key it returns the structured
              x402 challenge and spends nothing — safe to install and explore. Discovery metadata is
              published at{' '}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-blue-200">/.well-known/x402.json</code>{' '}
              for the standard agent indexes.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://x402.forgemesh.io"
                className="inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                Hit the API <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://www.npmjs.com/package/@forgemeshlabs/utility-grid-mcp"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
              >
                Utility Grid MCP
              </a>
              <a
                href="https://kit.forgemesh.io"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white"
              >
                Build your own x402 service
              </a>
            </div>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
