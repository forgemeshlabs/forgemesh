// The whole catalog on one page, README-table style — the answer to a nav
// that had grown to 37 links. Rows live in lib/tools-catalog.ts; the NavBar
// dropdowns show only the `featured` subset and link here for the rest.
import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { ToolsTable } from '@/components/ToolsTable';
import { TOOL_GROUPS, TOOL_COUNT } from '@/lib/tools-catalog';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'All Tools: Free Checkers, Paid APIs, MCP Servers | ForgeMesh',
  description:
    `Every ForgeMesh tool in one table: ${TOOL_COUNT} free tools, live data watches, pay-per-call x402/MPP APIs, and MCP servers on npm. Filter by name, cost, or who it is for.`,
  alternates: { canonical: '/tools' },
  openGraph: {
    title: 'All ForgeMesh tools, one table',
    description: 'Free checkers, live data watches, pay-per-call APIs for agents, and MCP servers — filterable.',
    type: 'website',
    url: 'https://forgemesh.io/tools',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@forgemeshlabs',
    title: 'All ForgeMesh tools, one table',
    description: 'Free checkers, live data watches, pay-per-call APIs for agents, and MCP servers — filterable.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'ForgeMesh tools and APIs',
  url: 'https://forgemesh.io/tools',
  numberOfItems: TOOL_COUNT,
  itemListElement: TOOL_GROUPS.flatMap((g) => g.rows)
    .map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.name,
      description: r.what,
      url: r.href.startsWith('http') ? r.href : `https://forgemesh.io${r.href}`,
    })),
};

export default function ToolsPage() {
  return (
    <>
      <NavBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main id="main-content" className="min-h-screen bg-[#050509] text-slate-100">
        <section className="relative px-4 pb-16 pt-28 sm:px-6 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.14),transparent_32%)]" />
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Catalog · {TOOL_COUNT} entries
              </span>
            </div>
            <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-4xl">
              Everything we run, one table.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Free tools for people, live data watches, pay-per-call APIs for agents, and MCP servers
              for builders. One line each. Filter, scan, click.
            </p>

            <div className="mt-8">
              <ToolsTable groups={TOOL_GROUPS} />
            </div>

            <p className="mt-10 text-xs leading-6 text-slate-500">
              Paid rows settle in USDC on Base over x402 or MPP; the price shown is the entry price
              on that surface, and every route publishes its own price in the 402 challenge. Free
              rows stay free. npm rows install with <code className="rounded bg-white/[0.06] px-1 py-0.5 text-slate-300">npx -y &lt;package&gt;</code>.
            </p>
          </div>
        </section>
        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
