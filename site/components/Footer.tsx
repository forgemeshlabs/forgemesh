const links = [
  { label: 'GitHub', href: 'https://github.com/forgemeshlabs' },
  { label: 'X / Twitter', href: 'https://x.com/kirothebot' },
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
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle cx="12" cy="12" r="2" fill="#60a5fa" />
                <circle cx="4" cy="6" r="1.5" fill="rgba(96,165,250,0.6)" />
                <circle cx="20" cy="6" r="1.5" fill="rgba(96,165,250,0.6)" />
                <circle cx="4" cy="18" r="1.5" fill="rgba(96,165,250,0.6)" />
                <circle cx="20" cy="18" r="1.5" fill="rgba(96,165,250,0.6)" />
                <line x1="12" y1="12" x2="4" y2="6" stroke="rgba(96,165,250,0.4)" strokeWidth="1" />
                <line x1="12" y1="12" x2="20" y2="6" stroke="rgba(96,165,250,0.4)" strokeWidth="1" />
                <line x1="12" y1="12" x2="4" y2="18" stroke="rgba(96,165,250,0.4)" strokeWidth="1" />
                <line x1="12" y1="12" x2="20" y2="18" stroke="rgba(96,165,250,0.4)" strokeWidth="1" />
              </svg>
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
