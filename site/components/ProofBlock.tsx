// Proof block under "How it pays". Every line is a dated fact that links to the
// post that documents it. No quotes, logos, or aggregate claims beyond those posts.
const proof = [
  {
    date: 'Oct 22, 2026',
    label: 'Protocol contribution',
    title: 'First merged ForgeMesh contribution to x402',
    body: 'A gap a buyer found on our seller fleet was fixed, sent upstream, and merged into the x402 protocol packages.',
    href: '/blog/x402-402-body-now-says-why',
  },
  {
    date: 'Aug 19, 2026',
    label: 'Field research',
    title: 'Health check of all 1,225 x402 Bazaar sellers',
    body: 'One live probe per seller: 74% healthy, 206 dead at their listed URL, 40 serving paid content for free.',
    href: '/blog/x402-bazaar-health-census-august-2026',
  },
  {
    date: 'Sep 7, 2026',
    label: 'First agent-paid order',
    title: 'An AI agent bought a shirt with curl',
    body: 'A real physical order on x402swag.com, paid in USDC on Base by an agent with no human involved. Receipt on-chain.',
    href: '/blog/first-x402-physical-order-bought-with-curl',
  },
];

export function ProofBlock() {
  return (
    <div className="mt-14">
      <p className="fm-eyebrow">Shipped, not promised</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {proof.map((p) => (
          <a
            key={p.href}
            href={p.href}
            data-umami-event="proof-card-click"
            data-umami-event-proof={p.label}
            className="group block rounded-xl border border-white/[0.08] bg-[#080810] p-6 transition-colors hover:border-blue-500/40 hover:no-underline"
          >
            <p className="text-xs font-mono text-slate-500">{p.date} · {p.label}</p>
            <h3 className="mt-2 text-lg font-medium text-slate-100 leading-snug">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">{p.body}</p>
            <span className="mt-4 inline-block text-sm text-blue-300 group-hover:text-blue-200">Read the post →</span>
          </a>
        ))}
      </div>
    </div>
  );
}
