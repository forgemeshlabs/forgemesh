'use client';

import { useState, useEffect } from 'react';
import { ForgeMeshMark } from './ForgeMeshMark';

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/[0.06] bg-[#050509]/90 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <ForgeMeshMark size={30} className="shrink-0" />
          <span className="text-sm font-medium text-slate-200 tracking-tight group-hover:text-white transition-colors">
            ForgeMesh Labs
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'How It Pays', href: '/#x402' },
            { label: 'MCP', href: '/#mcp' },
            { label: 'Projects', href: '/#projects' },
            { label: 'Philosophy', href: '/#philosophy' },
            { label: 'Discovery', href: '/#discovery' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 md:ml-8">
          <a
            href="https://kit.forgemesh.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-2.5 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20 hover:text-white active:translate-y-px sm:px-4"
          >
            <span className="sm:hidden">Free kit</span>
            <span className="hidden sm:inline">Free x402 checklist →</span>
          </a>

          <a
            href="https://discord.gg/ZwAUUfeQG"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AI Builders Unite Discord server 1515068093401923665"
            title="AI Builders Unite Discord server 1515068093401923665"
            className="flex h-8 items-center gap-2 rounded border border-white/[0.12] px-2.5 text-sm text-slate-300 transition-all hover:border-blue-500/50 hover:text-white active:translate-y-px sm:px-4"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M20.32 4.36A19.9 19.9 0 0015.36 2.8a.08.08 0 00-.08.04c-.22.4-.46.92-.62 1.34a18.6 18.6 0 00-5.58 0 13.5 13.5 0 00-.63-1.34.08.08 0 00-.08-.04 19.84 19.84 0 00-4.96 1.56.07.07 0 00-.03.03C.24 9.1-.61 13.7-.18 18.25a.08.08 0 00.03.05 20.1 20.1 0 006.08 3.06.08.08 0 00.09-.03c.47-.64.9-1.32 1.26-2.04a.08.08 0 00-.04-.11 13.22 13.22 0 01-1.9-.9.08.08 0 01-.01-.13c.13-.1.25-.2.37-.3a.08.08 0 01.08-.01c3.96 1.8 8.24 1.8 12.16 0a.08.08 0 01.09.01c.12.1.24.2.37.3a.08.08 0 01-.01.13c-.6.36-1.24.66-1.9.9a.08.08 0 00-.04.11c.37.72.79 1.4 1.26 2.04a.08.08 0 00.09.03 20.03 20.03 0 006.08-3.06.08.08 0 00.03-.05c.5-5.26-.84-9.82-3.54-13.86a.07.07 0 00-.03-.03zM7.8 15.49c-1.2 0-2.18-1.1-2.18-2.45s.96-2.45 2.18-2.45c1.22 0 2.2 1.11 2.18 2.45 0 1.35-.96 2.45-2.18 2.45zm8.14 0c-1.2 0-2.18-1.1-2.18-2.45s.96-2.45 2.18-2.45c1.22 0 2.2 1.11 2.18 2.45 0 1.35-.96 2.45-2.18 2.45z" />
            </svg>
            <span className="hidden sm:inline">Discord</span>
          </a>

          <a
            href="https://github.com/forgemeshlabs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 items-center gap-2 rounded border border-white/[0.12] px-2.5 text-sm text-slate-300 transition-all hover:border-blue-500/50 hover:text-white active:translate-y-px sm:px-4"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
