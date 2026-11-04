import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { NavBar } from '@/components/NavBar';
import { DubTownReserve } from '@/components/DubTownReserve';

const TITLE = 'Dub Town — A little place on the internet | ForgeMesh';
const DESC = 'Explore a town of websites. Visit your neighbors, give a Love Tap, and find a space for your site. Dub Town is open.';
export const metadata: Metadata = {
  title: TITLE, description: DESC, alternates: { canonical: 'https://forgemesh.io/dub-town' },
  openGraph: { title: TITLE, description: DESC, type: 'website', url: 'https://forgemesh.io/dub-town', images: [{ url: 'https://forgemesh.io/dub-town-share.png', width: 1200, height: 630, alt: 'Dub Town and its islands' }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['https://forgemesh.io/dub-town-share.png'] },
};
const prices = [
  ['First ordinary space', '$1', 'Free for eligible site owners through an email claim link.'],
  ['Branch', '$5', 'An additional space for a site that already has one.'],
  ['Garden', '$2', 'Replaces an open space with a tree, fountain or lamppost.'],
  ['Guildhall', '$25', 'The central seat of a Quarter.'],
  ['Palazzo', '$100', 'The city seat.'],
  ['Billboard face', '$0.50', 'Protected from takeover for 24 hours.'],
];
const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Dub Town', url: 'https://dub.town', applicationCategory: 'EntertainmentApplication', operatingSystem: 'Web', description: DESC, publisher: { '@type': 'Organization', name: 'ForgeMesh', url: 'https://forgemesh.io' } };

export default function DubTownPage() {
  return <><NavBar /><main id="main-content" className="min-h-dvh bg-[#101e1a] text-[#edf3ee]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-28 md:grid-cols-2 md:pt-36">
      <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-[#efd178]">Dub Town · Now open</p>
        <h1 className="mt-6 text-5xl font-semibold leading-[1.06] tracking-tight sm:text-6xl">A little place on the internet.</h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-[#b4c5bd]">A town built from websites, with islands to explore and neighbors to discover. Visit a rooftop, give it a Love Tap, and watch it grow.</p>
        <a href="https://dub.town/" className="mt-8 inline-flex min-h-12 items-center rounded-lg bg-[#efd178] px-6 py-3 font-semibold text-[#101e1a] hover:bg-[#f6dfa3] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efd178]">Visit Dub Town <span aria-hidden="true" className="ml-3">↗</span></a>
        <p className="mt-4 text-sm text-[#b4c5bd]">Free to explore. Card and Base USDC payments available.</p>
      </div>
      <div><img src="/dub-town-share.png" width={1200} height={630} alt="A map of Dub Town’s islands, beside the words A little place on the internet" className="h-auto w-full rounded-xl" /><p className="mt-4 text-sm leading-6 text-[#b4c5bd]">Square rooftops, Caribbean-blue water, and little surprises as you look around.</p></div>
    </section>
    <section className="mx-auto max-w-4xl border-t border-[#30433b] px-6 py-14">
      <h2 className="text-3xl font-semibold tracking-tight">Visit. Give a little love. Make a place.</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        <div><h3 className="font-semibold text-[#efd178]">Explore the town</h3><p className="mt-3 leading-7 text-[#b4c5bd]">Wander the Palazzo and Quarters. Watch residents on the move and sea life out on the water. Switch to night and see the windows light up.</p></div>
        <div><h3 className="font-semibold text-[#efd178]">Meet a website</h3><p className="mt-3 leading-7 text-[#b4c5bd]">Open a tile to visit its site, leave a Love Tap or buy the space. Example logos help you explore; they are not claims or endorsements.</p></div>
        <div><h3 className="font-semibold text-[#efd178]">Plant a garden</h3><p className="mt-3 leading-7 text-[#b4c5bd]">A garden makes that space unavailable for a website. Nobody can buy it while it’s planted. Only its owner can release it.</p></div>
      </div>
      <div id="reserve" className="mt-10 border-t border-[#30433b] pt-8"><DubTownReserve /></div>
    </section>
    <section className="mx-auto max-w-4xl border-t border-[#30433b] px-6 py-14">
      <h2 className="text-3xl font-semibold tracking-tight">A space for your site</h2>
      <p className="mt-4 leading-7 text-[#b4c5bd]">People can pay by card or use a wallet with USDC on Base. Agents can purchase through x402. The prices are the same.</p>
      <dl className="mt-8 divide-y divide-[#30433b]">{prices.map(([name, price, note])=><div key={name} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 py-4"><dt className="font-medium">{name}</dt><dd className="font-mono text-[#efd178]">{price}</dd><dd className="col-span-2 text-sm leading-6 text-[#b4c5bd]">{note}</dd></div>)}</dl>
      <p className="mt-6 text-sm leading-7 text-[#b4c5bd]"><strong className="text-[#edf3ee]">Spaces can change hands.</strong> Ordinary occupied spaces cost $2 to take over. Guildhall and Palazzo takeovers cost twice the last paid price. The displaced listing is removed, with no refund for that displacement. Review the quote and <a className="underline underline-offset-4" href="https://dub.town/terms">Terms</a> before purchasing.</p>
      <p className="mt-5 text-sm leading-7 text-[#b4c5bd]">Agents: start with <a className="underline underline-offset-4" href="https://dub.town/llms.txt">Dub Town’s agent guide</a>. Site owners: <a className="underline underline-offset-4" href="https://dub.town/?free=1">request your free first-space claim link</a>.</p>
      <a href="https://dub.town/" className="mt-8 inline-flex min-h-12 items-center rounded-lg bg-[#efd178] px-6 py-3 font-semibold text-[#101e1a]">Visit Dub Town ↗</a>
      <p className="mt-6 text-sm text-[#b4c5bd]"><a href="https://dub.town/privacy" className="underline underline-offset-4">Privacy</a> · <a href="mailto:hello@dub.town" className="underline underline-offset-4">Contact Dub Town</a></p>
    </section><ShareBar /><Footer /></main></>;
}
