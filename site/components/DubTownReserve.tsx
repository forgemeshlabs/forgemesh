// Keep the old component name for existing imports; reservations are now live claims.
export function DubTownReserve() {
  return <div>
    <h3 className="text-xl font-semibold text-[#edf3ee]">Your site? Claim it for free</h3>
    <p className="mt-3 max-w-2xl leading-7 text-[#b4c5bd]">Use an email address at your website’s domain to request a claim link. Your first ordinary space is free. Premium spaces, extra branches and takeovers are paid.</p>
    <a href="https://dub.town/?free=1" className="mt-5 inline-flex min-h-12 items-center rounded-lg border border-[#efd178] px-5 py-3 font-medium text-[#efd178] hover:bg-[#efd178]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efd178]">Claim your free space ↗</a>
  </div>;
}
