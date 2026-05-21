const principles = [
  {
    statement: 'Software should control execution.',
    detail: 'Logic, not humans, decides what runs and when. Agents operate within defined contracts, not open-ended instructions.',
  },
  {
    statement: 'Models should generate content.',
    detail: 'LLMs are content engines. The infrastructure around them must be deterministic, auditable, and machine-verifiable.',
  },
  {
    statement: 'Every action should be verifiable.',
    detail: "If you can't prove an agent did what it said, you don't have an autonomous system. You have a suggestion engine.",
  },
];

export function Philosophy() {
  return (
    <section id="philosophy" className="py-32 px-6 bg-[#050509]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <p className="text-xs tracking-widest uppercase text-blue-400/70 mb-4">Philosophy</p>
        </div>

        {/* Primary statement */}
        <blockquote className="mb-16">
          <p className="text-3xl sm:text-4xl lg:text-5xl font-medium text-slate-200 leading-[1.15] tracking-tight">
            The rails should be{' '}
            <span className="text-slate-500">invisible.</span>
            {' '}The execution should be{' '}
            <span className="text-slate-500">undeniable.</span>
          </p>
        </blockquote>

        <div className="space-y-0 divide-y divide-white/[0.06]">
          {principles.map((p, i) => (
            <div key={i} className="py-8 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 sm:gap-12">
              <div className="flex items-start gap-3 sm:w-72">
                <span className="mt-1 text-xs font-mono text-blue-400/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-base font-medium text-slate-200">{p.statement}</p>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{p.detail}</p>
            </div>
          ))}
        </div>

        {/* Closing line */}
        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <p className="text-xs font-mono text-slate-700 tracking-widest uppercase">
            ForgeMesh Labs — 2025 — Experimental infrastructure for autonomous systems
          </p>
        </div>
      </div>
    </section>
  );
}
