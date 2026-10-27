import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Where ForgeMesh is listed',
  description:
    'Every registry, package index and directory where ForgeMesh services, MCP servers and the Pay-per-Crawl editions are listed. Free listings only, no badges.',
  alternates: { canonical: '/listed' },
  openGraph: {
    title: 'Where ForgeMesh is listed',
    description:
      'Registries, package indexes and directories carrying ForgeMesh services, MCP servers and Pay-per-Crawl. Free listings only.',
    url: 'https://forgemesh.io/listed',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

const UPDATED = '2026-10-27';

type Listing = {
  name: string;
  what: string;
  href: string;
  /** Directories we have not vetted for authority get rel=nofollow. */
  nofollow?: boolean;
};

type Group = { heading: string; blurb: string; items: Listing[] };

const GROUPS: Group[] = [
  {
    heading: 'Package indexes',
    blurb: 'The Pay-per-Crawl editions and the MCP servers, installable from the official registries.',
    items: [
      { name: 'WordPress.org plugin directory', what: 'ForgeMesh Pay-per-Crawl plugin', href: 'https://wordpress.org/plugins/forgemesh-pay-per-crawl/' },
      { name: 'npm', what: 'Pay-per-Crawl JS edition and 20 MCP servers under @forgemeshlabs', href: 'https://www.npmjs.com/org/forgemeshlabs' },
      { name: 'PyPI', what: 'forgemesh-pay-per-crawl (Python edition)', href: 'https://pypi.org/project/forgemesh-pay-per-crawl/' },
      { name: 'Packagist', what: 'forgemesh/pay-per-crawl-core (PHP, Laravel, Drupal)', href: 'https://packagist.org/packages/forgemesh/pay-per-crawl-core' },
      { name: 'Drupal.org', what: 'Pay per Crawl module', href: 'https://www.drupal.org/project/pay_per_crawl' },
    ],
  },
  {
    heading: 'MCP registries',
    blurb: 'Where agent runtimes discover the ForgeMesh MCP servers.',
    items: [
      { name: 'Official MCP Registry', what: '20 servers under io.github.forgemeshlabs', href: 'https://registry.modelcontextprotocol.io/v0/servers?search=io.github.forgemeshlabs' },
      { name: 'Glama', what: 'ForgeMesh MCP servers with build and security scores', href: 'https://glama.ai/mcp/servers?query=forgemesh' },
      { name: 'mcpservers.org', what: 'Crypto Signals and SEO Authority servers, editorially approved', href: 'https://mcpservers.org/servers/forgemeshlabs/crypto-signals-mcp' },
    ],
  },
  {
    heading: 'Agent and x402 marketplaces',
    blurb: 'Where paying agents find the live x402 services.',
    items: [
      { name: 'x402-list.com', what: 'Seven ForgeMesh services with independent uptime and payment checks', href: 'https://x402-list.com/services/forgemesh-x402-router' },
      { name: 'hashn agent store', what: '16 ForgeMesh services, one listing each', href: 'https://hashn.com/store/eb2b9a28-4d3e-4f7e-bf31-25ff7b16f20d' },
      { name: 'PayAPI Market', what: 'Kronos by ForgeMesh', href: 'https://payapi.market/api/kronos-by-forgemesh' },
      { name: 'ag3ntsearch', what: 'x402swag.com, first agent-paid physical order on record', href: 'https://ag3ntsearch.com/entry/x402swag.html' },
    ],
  },
  {
    heading: 'Tool directories',
    blurb: 'Editorial and crawler-built directories that list Pay-per-Crawl or ForgeMesh Labs at no charge.',
    items: [
      { name: 'SiftFox', what: 'Pay-per-Crawl, Developer Tools', href: 'https://siftfox.com/tool/pay-per-crawl', nofollow: true },
      { name: 'YourAITools', what: 'ForgeMesh Labs, crypto-paid APIs', href: 'https://youraitools.co/tool/forgemesh-labs', nofollow: true },
      { name: 'Digidle', what: 'ForgeMesh Pay-per-Crawl, developer tools', href: 'https://digidle.com/tools/forgemesh-pay-per-crawl/', nofollow: true },
    ],
  },
];

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen bg-[#050509] text-slate-100">
        <section className="px-6 pb-16 pt-28 sm:pt-36">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                Listed · updated {UPDATED}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-slate-50 sm:text-5xl">
              Where ForgeMesh is listed.
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-400">
              Every registry, package index and directory that carries a ForgeMesh service, an MCP
              server or a Pay-per-Crawl edition. All of these listings are free. We do not buy
              placements and we do not embed directory badges on product pages, so if you found us
              through one of these, the directory listed us on merit or built the entry from public
              data.
            </p>

            <div className="mt-12 space-y-12">
              {GROUPS.map((g) => (
                <section key={g.heading}>
                  <h2 className="text-xl font-semibold text-slate-50">{g.heading}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{g.blurb}</p>
                  <ul className="mt-4 divide-y divide-white/[0.06] rounded border border-white/[0.06] bg-white/[0.02]">
                    {g.items.map((it) => (
                      <li key={it.href} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                        <div className="min-w-0">
                          <a
                            href={it.href}
                            target="_blank"
                            rel={it.nofollow ? 'nofollow noopener noreferrer' : 'noopener noreferrer'}
                            className="text-[15px] font-medium text-blue-400 hover:text-blue-300"
                          >
                            {it.name}
                          </a>
                          <p className="text-sm leading-6 text-slate-400">{it.what}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <section className="mt-14 rounded border border-white/[0.06] bg-white/[0.02] p-6 text-sm leading-7 text-slate-400">
              <h2 className="text-base font-semibold text-slate-100">Run a directory?</h2>
              <p className="mt-2">
                If you have listed a ForgeMesh service at no charge and want it on this page, write to{' '}
                <a href="mailto:hello@forgemesh.io" className="text-blue-400 hover:text-blue-300">hello@forgemesh.io</a>{' '}
                with the live URL. We add free listings once they are live. We do not add paid
                placements, and we do not place badges on our pages in exchange for a listing.
              </p>
              <p className="mt-2">
                Looking for the services themselves? The{' '}
                <a href="/tools" className="text-blue-400 hover:text-blue-300">catalog</a> has every live
                endpoint, and{' '}
                <a href="/verified" className="text-blue-400 hover:text-blue-300">x402 Verified</a> is our own
                index of sellers with independently confirmed paid receipts.
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
