import { ArrowRight } from 'lucide-react';

// Real current price of the x402 Server Starter Kit (Tier 1) on kit.forgemesh.io.
// Keep in sync with the kit page and the tools catalog row.
const KIT_PRICE = '$49';

const primary =
  'inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20';
const secondary =
  'inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white';

/**
 * Starter Kit call-to-action. `slug` feeds utm_campaign, `placement` names the spot
 * for the Umami `kit-click` event (same event the global click listener emits).
 */
export function KitCta({
  slug,
  placement,
  path,
  className = 'mt-12',
}: {
  slug: string;
  placement: string;
  path: string;
  className?: string;
}) {
  const utm = `utm_source=forgemesh&utm_medium=cta&utm_campaign=${encodeURIComponent(slug)}`;
  return (
    <aside
      aria-label="x402 Starter Kit"
      className={`${className} rounded border border-blue-500/25 bg-blue-500/[0.06] p-6`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">x402 Server Starter Kit</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50">Ship a paid x402 endpoint this weekend</h2>
      <p className="mt-3 text-base leading-7 text-slate-300">
        An agent build-brief your AI coder executes, manifest and payment-config templates, and x402 + MPP dual-stack
        middleware, settlement-proven in production. Includes the buyers&apos; Discord.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <a
          href={`https://kit.forgemesh.io/?${utm}`}
          data-umami-event="kit-click"
          data-umami-event-placement={placement}
          data-umami-event-from={path}
          className={primary}
        >
          Get the Starter Kit — {KIT_PRICE} <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
        <a
          href={`https://kit.forgemesh.io/?${utm}#free`}
          data-umami-event="kit-click"
          data-umami-event-placement={`${placement}:free-checklist`}
          data-umami-event-from={path}
          className={secondary}
        >
          Or score your idea with the free checklist
        </a>
      </div>
    </aside>
  );
}

/** Lead CTA for the Crawler Atlas pages: charge the bots with Pay-per-Crawl. */
export function CrawlCta({ placement, className = 'mt-14' }: { placement: string; className?: string }) {
  return (
    <aside
      aria-label="Pay-per-Crawl"
      className={`${className} rounded border border-blue-500/25 bg-blue-500/[0.06] p-6`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Pay-per-Crawl</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50">Charge these bots</h2>
      <p className="mt-3 text-base leading-7 text-slate-300">
        Free plugin, Pro $4.99/mo. Answer every crawler on this page with a price instead of a block, and keep the revenue.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <a
          href="/wordpress"
          data-umami-event="ppc-click"
          data-umami-event-placement={placement}
          className={primary}
        >
          Get the free plugin <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </aside>
  );
}
