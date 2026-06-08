const principles = [
  {
    statement: 'Curiosity matters more than credentials.',
    detail: 'You do not need a title, a pedigree, or permission to start building. Questions are a valid entry point.',
  },
  {
    statement: 'Humans and agents build better together.',
    detail: 'People bring judgment, taste, and intent. Agents bring reach, memory, and speed. Systems make the work durable.',
  },
  {
    statement: 'No builder should feel irrelevant.',
    detail: 'ForgeMesh is built for first workflows, serious infrastructure, solo experiments, and new companies in the same connected economy.',
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
            Every Builder{' '}
            <span className="text-slate-500">Belongs.</span>
          </p>
        </blockquote>

        <div className="mb-16 max-w-3xl space-y-5 text-base sm:text-lg text-slate-400 leading-relaxed">
          <p>
            We believe the future will not be built by humans alone, nor by AI alone.
            It will be built through collaboration between people, agents, and systems.
          </p>
          <p>
            ForgeMesh rejects gatekeeping, elitism, and the idea that only experts can
            contribute. Every builder starts somewhere. Every builder has something to
            teach.
          </p>
        </div>

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
            Forged Through Curiosity. Connected Through Collaboration.
          </p>
        </div>
      </div>
    </section>
  );
}
