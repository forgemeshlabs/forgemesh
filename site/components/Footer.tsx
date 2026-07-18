import { ForgeMeshMark } from './ForgeMeshMark';

const links = [
  { label: 'What is x402?', href: '/x402' },
  { label: 'HTTP 402 history', href: '/402-payment-required' },
  { label: 'Blog', href: '/blog' },
  { label: 'GitHub', href: 'https://github.com/forgemeshlabs' },
  { label: 'X / Twitter', href: 'https://x.com/forgemeshlabs' },
  {
    label: 'AI Builders Unite',
    href: 'https://discord.gg/ZwAUUfeQG',
    title: 'Discord server 1515068093401923665',
  },
  { label: 'Field Notes', href: 'https://aitinkers.fun' },
  { label: 'npm', href: 'https://www.npmjs.com/package/forgemesh' },
  { label: 'MCP Registry', href: 'https://github.com/modelcontextprotocol/servers' },
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
                    title={link.title}
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

        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] text-slate-800 font-mono">
            © 2025 ForgeMesh Labs. MIT License.
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
