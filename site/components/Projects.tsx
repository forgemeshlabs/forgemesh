const projects = [
  {
    name: 'coinopai-mcp',
    surface: 'MCP package',
    description:
      'Paid crypto intelligence MCP server. LLMs call tools that cost USDC — Kronos signals, trade decisions, and agent automation prompts on Base mainnet.',
    tags: ['MCP', 'x402', 'crypto intelligence'],
    status: 'active',
    npm: 'https://www.npmjs.com/package/coinopai-mcp',
    github: 'https://github.com/forgemeshlabs/coinopai-mcp',
    url: 'https://x402.coinopai.com',
  },
  {
    name: 'forgemesh-imagegen',
    surface: 'MCP package',
    description:
      'AI image generation via x402 micropayments. 4 tiers ($0.25-$0.75 USDC) on Base mainnet — no API key, pay per call.',
    tags: ['MCP', 'x402', 'image-gen', 'USDC', 'Base'],
    status: 'active',
    npm: 'https://www.npmjs.com/package/forgemesh-imagegen',
    github: 'https://github.com/forgemeshlabs/imagegen-mcp',
    url: 'https://imagegen.coinopai.com',
  },
  {
    name: 'DisruptionIntel',
    surface: 'Hosted API + MCP package',
    description:
      'Source-linked WARN and workforce disruption intelligence. Agents unlock company, region, territory, watchlist, Ripple Signals, Ripple Paths, and Disruption Intelligence Ripple Reports through 23 x402-paid endpoints from $0.01-$0.25 on Base mainnet.',
    tags: ['MCP', 'x402', 'WARN', 'commercial intelligence', 'Base'],
    status: 'active',
    npm: 'https://www.npmjs.com/package/@forgemeshlabs/disruption-intelligence-mcp',
    github: 'https://github.com/forgemeshlabs/disruption-intelligence-mcp',
    url: 'https://disruption.forgemesh.io',
  },
  {
    name: 'affiliate-router-mcp',
    surface: 'MCP package',
    description:
      'Vendor-neutral monetization routing. Agents generate affiliate-linked product recommendations without hardcoded merchant logic.',
    tags: ['MCP', 'affiliate', 'routing'],
    status: 'active',
    npm: 'https://www.npmjs.com/package/affiliate-router-mcp',
    github: 'https://github.com/forgemeshlabs/affiliate-router-mcp',
  },
  {
    name: 'Travel Assistant MCP',
    surface: 'MCP package',
    description:
      'Free travel-planning MCP server for destination guidance, flexible fare search planning, airport context, route comparison, booking-link generation, and timing explanations.',
    tags: ['MCP', 'travel', 'fare intelligence'],
    status: 'active',
    npm: 'https://www.npmjs.com/package/@forgemeshlabs/travel-assistant-mcp',
    github: 'https://github.com/forgemeshlabs/travel-mcp',
    url: 'https://travel.forgemesh.io',
  },
  {
    name: 'ASO Audit MCP',
    surface: 'MCP package',
    description:
      'Free Agent Signal Optimization scanner. Agents audit whether a website, API, or tool can be discovered, trusted, understood, and used by other agents.',
    tags: ['MCP', 'ASO', 'agent readiness'],
    status: 'active',
    npm: 'https://www.npmjs.com/package/@forgemeshlabs/aso-audit-mcp',
    github: 'https://github.com/forgemeshlabs/aso-audit-mcp',
    url: 'https://agentsignaloptimization.com',
  },
  {
    name: 'ASO Score MCP',
    surface: 'MCP package',
    description:
      'ASO Score namespace package for the same scanner core. Agents measure a 0-100 Agent Readiness Index and get a prioritized remediation plan.',
    tags: ['MCP', 'ASO score', 'agent readiness'],
    status: 'active',
    npm: 'https://www.npmjs.com/package/@forgemeshlabs/aso-score-mcp',
    github: 'https://github.com/forgemeshlabs/aso-score-mcp',
    url: 'https://agentsignaloptimization.com',
  },
  {
    name: 'Agent Readiness MCP',
    surface: 'MCP package',
    description:
      'Agent Readiness namespace package for the ASO scanner core, aligned with Google Search and browser-agent guidance without claiming Google ranking impact.',
    tags: ['MCP', 'agent readiness', 'agent-friendly websites'],
    status: 'active',
    npm: 'https://www.npmjs.com/package/@forgemeshlabs/agent-readiness-mcp',
    github: 'https://github.com/forgemeshlabs/agent-readiness-mcp',
    url: 'https://agentsignaloptimization.com',
  },
  {
    name: 'CoinOpAI x402 API',
    surface: 'Hosted API',
    description:
      'Private hosted x402 API for Kronos signals, trade preflight, trade audit, and automation prompt retrieval. Agents pay per request in USDC on Base mainnet.',
    tags: ['x402', 'USDC', 'Base', 'hosted API'],
    status: 'active',
    url: 'https://x402.coinopai.com',
  },
  {
    name: 'forgemesh',
    surface: 'Umbrella package',
    description:
      'Ecosystem umbrella package and public registry for the ForgeMesh website, discovery files, and package index.',
    tags: ['ecosystem', 'npm', 'documentation'],
    status: 'active',
    npm: 'https://www.npmjs.com/package/forgemesh',
    github: 'https://github.com/forgemeshlabs/forgemesh',
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-16 px-6" style={{ background: '#080810' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs tracking-widest uppercase text-blue-400/70 mb-4">Projects</p>
          <h2 className="text-3xl sm:text-4xl font-medium text-slate-100 tracking-tight">
            Active systems
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl">
            Published packages and services currently running in production.
            Each one is a discrete, independently deployable component.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map(proj => (
            <article
              key={proj.name}
              className="group relative p-6 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-blue-500/20 hover:bg-blue-500/[0.03] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-mono text-sm font-medium text-slate-200">{proj.name}</h3>
                    <span className="text-[10px] font-mono text-slate-600">{proj.surface}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
                    <span className="text-[10px] text-green-500 font-mono">status: {proj.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {proj.url && (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono px-2 py-1 rounded border border-white/[0.08] text-slate-500 hover:text-slate-300 hover:border-white/20 transition-colors"
                      aria-label={`${proj.name} live site`}
                    >
                      live ↗
                    </a>
                  )}
                  {proj.npm && (
                    <a
                      href={proj.npm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono px-2 py-1 rounded border border-white/[0.08] text-slate-500 hover:text-slate-300 hover:border-white/20 transition-colors"
                      aria-label={`${proj.name} on npm`}
                    >
                      npm
                    </a>
                  )}
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded border border-white/[0.08] text-slate-500 hover:text-slate-300 hover:border-white/20 transition-colors"
                      aria-label={`${proj.name} on GitHub`}
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed mb-4">{proj.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {proj.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.06] text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
