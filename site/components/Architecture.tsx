const stages = [
  {
    id: 'agents',
    label: 'Agents',
    sublabel: 'autonomous actors',
    metrics: ['LLM-driven', 'stateful', 'goal-directed'],
    color: '#60a5fa',
  },
  {
    id: 'verification',
    label: 'Verification',
    sublabel: 'output integrity',
    metrics: ['cryptographic proof', 'ledger-backed', 'replay-safe'],
    color: '#818cf8',
  },
  {
    id: 'execution',
    label: 'Execution Engine',
    sublabel: 'deterministic runtime',
    metrics: ['task routing', 'dependency graphs', 'audit trail'],
    color: '#a78bfa',
  },
  {
    id: 'payment',
    label: 'Payment Rails',
    sublabel: 'x402 settlement',
    metrics: ['USDC on Base', 'per-request billing', 'machine-native'],
    color: '#c084fc',
  },
  {
    id: 'audit',
    label: 'Audit Layer',
    sublabel: 'observability',
    metrics: ['execution traces', 'payment events', 'queryable state'],
    color: '#e879f9',
  },
];

export function Architecture() {
  return (
    <section id="architecture" className="py-32 px-6 bg-[#050509]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs tracking-widest uppercase text-blue-400/70 mb-4">Architecture</p>
          <h2 className="text-3xl sm:text-4xl font-medium text-slate-100 tracking-tight">
            Layered execution model
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl">
            Every autonomous operation flows through five discrete layers.
            No shortcuts. No opaque black boxes.
          </p>
        </div>

        {/* Flow diagram */}
        <div className="relative">
          {/* Connecting SVG lines */}
          <div aria-hidden="true" className="hidden lg:block absolute top-10 left-0 right-0 px-12">
            <svg viewBox="0 0 900 20" className="w-full" preserveAspectRatio="none">
              <line
                x1="0" y1="10" x2="900" y2="10"
                stroke="rgba(59,130,246,0.15)"
                strokeWidth="1"
              />
              <line
                x1="0" y1="10" x2="900" y2="10"
                stroke="rgba(96,165,250,0.5)"
                strokeWidth="1"
                strokeDasharray="6 18"
                style={{ animation: 'flow-right 2s linear infinite' }}
              />
            </svg>
          </div>

          {/* Stage cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stages.map((stage, i) => (
              <div key={stage.id} className="flex flex-col items-center text-center">
                {/* Node */}
                <div
                  className="relative w-20 h-20 rounded-full flex items-center justify-center mb-4 border"
                  style={{
                    borderColor: `${stage.color}30`,
                    background: `${stage.color}08`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{
                      background: stage.color,
                      boxShadow: `0 0 20px ${stage.color}40`,
                    }}
                  />
                  {/* Outer ring */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border animate-pulse-slow"
                    style={{ borderColor: `${stage.color}20` }}
                  />
                  {/* Step number */}
                  <span
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-medium"
                    style={{
                      background: '#080810',
                      border: `1px solid ${stage.color}40`,
                      color: stage.color,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-sm font-medium text-slate-200 mb-1">{stage.label}</h3>
                <p className="text-xs text-slate-500 mb-3">{stage.sublabel}</p>

                <ul className="space-y-1">
                  {stage.metrics.map(m => (
                    <li key={m} className="text-[10px] text-slate-600 font-mono">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Properties row */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Deterministic', desc: 'Same inputs always produce same outputs' },
            { label: 'Ledger-backed', desc: 'Every event is cryptographically anchored' },
            { label: 'Verifiable', desc: 'Third-party inspection without trust' },
            { label: 'Machine-native', desc: 'No human approval loops required' },
          ].map(p => (
            <div
              key={p.label}
              className="p-4 rounded border border-white/[0.06] bg-white/[0.02]"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-xs font-medium text-slate-300">{p.label}</span>
              </div>
              <p className="text-[11px] text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
