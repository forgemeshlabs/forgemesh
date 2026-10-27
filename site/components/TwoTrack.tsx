// Audience fork right under the hero: one card per visitor type.
const tracks = [
  {
    eyebrow: 'For agent builders',
    title: 'Give your agent paid tools',
    body: 'Pick from live pay-per-call APIs and MCP servers your agent can use with no account and no API key.',
    links: [
      { label: 'Browse paid APIs', href: '/tools', event: 'fork-agents-tools' },
      { label: 'MCP servers', href: '#mcp', event: 'fork-agents-mcp' },
    ],
  },
  {
    eyebrow: 'For site & API owners',
    title: 'Get paid when agents call you',
    body: 'Charge AI crawlers per page with a Pay-per-Crawl plugin, or run the free pre-flight checklist before you list an x402 API.',
    links: [
      { label: 'Pay-per-Crawl plugins', href: '/plugins', event: 'fork-owners-plugins' },
      { label: 'x402 seller checklist', href: '/checklist', event: 'fork-owners-checklist' },
    ],
  },
];

export function TwoTrack() {
  return (
    <section aria-label="Choose your path" className="px-6 pb-4 bg-[#050509]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 gap-4 md:grid-cols-2">
        {tracks.map((t) => (
          <div
            key={t.eyebrow}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-blue-500/30 hover:bg-blue-500/[0.03]"
          >
            <p className="text-xs tracking-widest uppercase text-blue-400/70 mb-2">{t.eyebrow}</p>
            <h2 className="text-xl font-medium text-slate-100 tracking-tight">{t.title}</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">{t.body}</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {t.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  data-umami-event={l.event}
                  className="text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors"
                >
                  {l.label} →
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
