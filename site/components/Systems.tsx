const systems = [
  {
    id: 'x402',
    label: 'x402 Infrastructure',
    description:
      'HTTP-native payment middleware that lets autonomous agents pay for resources without wallets, OAuth, or human intervention.',
    tags: ['micropayments', 'USDC', 'Base'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    id: 'mcp',
    label: 'MCP Servers',
    description:
      'Model Context Protocol servers that expose monetized tooling to LLMs — from crypto intelligence to image generation.',
    tags: ['MCP', 'tooling', 'LLM integration'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8h.01M11 8h6" />
        <path d="M7 12h.01M11 12h6" />
      </svg>
    ),
  },
  {
    id: 'orchestration',
    label: 'Agent Orchestration',
    description:
      'Deterministic task routing and execution graphs for multi-agent workflows. Replay-safe. Auditable. Machine-native.',
    tags: ['execution graphs', 'determinism', 'replay-safe'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <circle cx="18" cy="5" r="2" />
        <circle cx="6" cy="12" r="2" />
        <circle cx="18" cy="19" r="2" />
        <path d="M8 12h6M8 12L16 5M8 12l8 7" />
      </svg>
    ),
  },
  {
    id: 'verification',
    label: 'Verification Layers',
    description:
      'Cryptographic output verification for agent-generated content. Ledger-backed events with provenance and replay guarantees.',
    tags: ['cryptographic proofs', 'ledger', 'provenance'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M12 3l8 4v5c0 5.55-3.84 10.74-8 12-4.16-1.26-8-6.45-8-12V7l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'commerce',
    label: 'Autonomous Commerce',
    description:
      'Machine-to-machine commerce primitives. Agents discover, negotiate, and settle transactions without human approval loops.',
    tags: ['M2M', 'settlement', 'agentic market'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <circle cx="9" cy="21" r="1" fill="currentColor" stroke="none" />
        <circle cx="20" cy="21" r="1" fill="currentColor" stroke="none" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.94-1.5l1.92-7.5H6" />
      </svg>
    ),
  },
  {
    id: 'telemetry',
    label: 'Runtime Telemetry',
    description:
      'Structured observability for autonomous systems. Execution traces, payment events, and agent state changes — all queryable.',
    tags: ['traces', 'events', 'observability'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

export function Systems() {
  return (
    <section id="systems" className="py-16 px-6" style={{ background: '#080810' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs tracking-widest uppercase text-blue-400/70 mb-4">Systems</p>
          <h2 className="text-3xl sm:text-4xl font-medium text-slate-100 tracking-tight">
            Protocol-grade building blocks
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl">
            Each system is a discrete layer in the autonomous execution stack.
            Composable. Independently deployable. Production-hardened.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05] rounded-xl overflow-hidden border border-white/[0.05]">
          {systems.map((sys) => (
            <div
              key={sys.id}
              className="group relative p-6 bg-[#080810] hover:bg-[#0c0c18] transition-colors cursor-default"
            >
              {/* Hover glow border */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 0 1px rgba(59,130,246,0.25)',
                }}
              />

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2.5 rounded border border-white/[0.08] text-blue-400 bg-blue-500/[0.06] group-hover:border-blue-500/30 transition-colors">
                  {sys.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-200 mb-2">{sys.label}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{sys.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sys.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.06] text-slate-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
