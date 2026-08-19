import { ForgeMeshMark } from './ForgeMeshMark';

const links = [
  { label: 'What is x402?', href: '/x402' },
  { label: 'HTTP 402 history', href: '/402-payment-required' },
  { label: 'Blog', href: '/blog' },
  { label: 'GitHub', href: 'https://github.com/forgemeshlabs' },
  { label: 'X / Twitter', href: 'https://x.com/forgemeshlabs' },
  { label: 'Field Notes', href: 'https://aitinkers.fun' },
  { label: 'npm', href: 'https://www.npmjs.com/package/forgemesh' },
  { label: 'MCP Registry', href: 'https://github.com/modelcontextprotocol/servers' },
  { label: 'The Brief', href: '/brief' },
  { label: 'Contact', href: 'mailto:hello@forgemesh.io' },
];

export function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-white/[0.06]" style={{ background: '#050509' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <ForgeMeshMark size={26} className="shrink-0" />
              <span className="text-sm font-medium text-slate-400">ForgeMesh Labs</span>
            </div>
            <p className="text-xs text-slate-700 font-mono">
              Experimental infrastructure for autonomous systems.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* The Brief — event-driven newsletter signup. Posts to the kit funnel's
            subscriber store with source=brief so campaign tooling can segment. */}
        <div className="mt-12 rounded border border-white/[0.06] bg-white/[0.02] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div className="max-w-md">
            <p className="text-sm font-medium text-slate-300">The ForgeMesh Brief</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              No weekly filler. We email when the x402 ecosystem actually moves — our monitoring
              usually notices before anyone announces it.{' '}
              <a href="/brief" className="text-blue-500/80 hover:text-blue-400">Why subscribe?</a>
            </p>
          </div>
          <form
            method="POST"
            action="https://kit.forgemesh.io/subscribe"
            className="mt-4 flex gap-2 sm:mt-0"
          >
            <input type="hidden" name="source" value="brief" />
            <input
              type="email"
              name="email"
              required
              placeholder="you@company.com"
              aria-label="Email address"
              className="w-full min-w-0 rounded border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:outline-none sm:w-56"
            />
            <button
              type="submit"
              className="shrink-0 rounded border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] text-slate-800 font-mono">
            © 2026 GSD Contracts LLC, d/b/a ForgeMesh Labs. MIT License. ·{' '}
            <a href="tel:+12817270506" className="hover:text-slate-500">
              +1 (281) 727-0506
            </a>{' '}
            (AI receptionist, always on)
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-slow" />
            <span className="text-[11px] text-slate-700 font-mono">systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
