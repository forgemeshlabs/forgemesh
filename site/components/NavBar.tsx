'use client';

import { useState, useEffect } from 'react';

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
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative w-6 h-6">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
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
          </div>
          <span className="text-sm font-medium text-slate-200 tracking-tight group-hover:text-white transition-colors">
            ForgeMesh Labs
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {['Systems', 'Architecture', 'Projects', 'Philosophy'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <a
          href="https://github.com/forgemeshlabs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm px-4 py-1.5 rounded border border-white/[0.12] text-slate-300 hover:border-blue-500/50 hover:text-white transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          GitHub
        </a>
      </div>
    </nav>
  );
}
