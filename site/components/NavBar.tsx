'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ForgeMeshMark } from './ForgeMeshMark';
import { RailTicker } from './RailTicker';
import { featured } from '@/lib/tools-catalog';

// Dropdowns show only the catalog's `featured` rows; everything else lives on
// /tools (operator, 2026-09-04: the menu had grown to 37 links). To promote
// something into a dropdown, flip `featured: true` in lib/tools-catalog.ts.
const hub = (label: string, id: string) => ({ label, href: `/tools#${id}`, hub: true as const });
type NavLink = { label: string; href: string; hub?: true };

const learnLinks: NavLink[] = [...featured('learn').map(r => ({ label: r.name, href: r.href })), hub('All guides →', 'learn')];
const freeLinks: NavLink[] = [
  ...featured('free').map(r => ({ label: r.name, href: r.href })),
  ...featured('watch').map(r => ({ label: r.name, href: r.href })),
  hub('All free tools + live data →', 'free'),
];
const productLinks: NavLink[] = [
  ...featured('paid').map(r => ({ label: r.name, href: r.href })),
  ...featured('mcp').map(r => ({ label: r.name, href: r.href })),
  hub('All APIs + MCP servers →', 'paid'),
];

const topLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'The Brief', href: '/brief' },
  { label: 'Texas Watch', href: '/texas' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Tools', href: '/tools' },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: close on Escape, lock page scroll while open, and reset if
  // the viewport grows past the md breakpoint (desktop nav takes over).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const mq = window.matchMedia('(min-width: 768px)');
    const onResize = () => { if (mq.matches) setOpen(false); };
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onResize);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onResize);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-white/[0.06] bg-[#050509]/90 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <a href="/" className="flex items-center gap-2.5 group">
          <ForgeMeshMark size={30} className="shrink-0" />
          <span className="text-sm font-medium text-slate-200 tracking-tight group-hover:text-white transition-colors">
            ForgeMesh Labs
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {topLinks.map(item => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="group relative flex h-16 items-center">
            <a
              href="/#projects"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Projects
            </a>
            <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 translate-y-1 rounded border border-white/[0.08] bg-[#050509]/95 p-2 opacity-0 shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {productLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`block rounded px-3 py-2 text-sm transition-colors hover:bg-blue-500/10 hover:text-slate-100 focus:bg-blue-500/10 focus:text-slate-100 focus:outline-none ${link.hub ? 'mt-1 border-t border-white/[0.06] pt-2.5 text-blue-300' : 'text-slate-400'}`}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="group relative flex h-16 items-center">
            <a
              href="/x402"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Learn
            </a>
            <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 translate-y-1 rounded border border-white/[0.08] bg-[#050509]/95 p-2 opacity-0 shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {learnLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`block rounded px-3 py-2 text-sm transition-colors hover:bg-blue-500/10 hover:text-slate-100 focus:bg-blue-500/10 focus:text-slate-100 focus:outline-none ${link.hub ? 'mt-1 border-t border-white/[0.06] pt-2.5 text-blue-300' : 'text-slate-400'}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="group relative flex h-16 items-center">
            <a
              href="/scan"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Free
            </a>
            <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 translate-y-1 rounded border border-white/[0.08] bg-[#050509]/95 p-2 opacity-0 shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {freeLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`block rounded px-3 py-2 text-sm transition-colors hover:bg-blue-500/10 hover:text-slate-100 focus:bg-blue-500/10 focus:text-slate-100 focus:outline-none ${link.hub ? 'mt-1 border-t border-white/[0.06] pt-2.5 text-blue-300' : 'text-slate-400'}`}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:ml-8">
          <a
            href="https://x402swag.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 shrink-0 items-center gap-2 whitespace-nowrap rounded border border-white/[0.12] px-2.5 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white active:translate-y-px sm:px-4"
          >
            <span className="sm:hidden">Swag</span>
            <span className="hidden sm:inline">x402 Swag</span>
          </a>

          <a
            href="https://kit.forgemesh.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 shrink-0 items-center gap-2 whitespace-nowrap rounded border border-blue-500/40 bg-blue-500/10 px-2.5 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20 hover:text-white active:translate-y-px sm:px-4"
          >
            <span className="sm:hidden">Free kit</span>
            <span className="hidden sm:inline">Free x402 checklist</span>
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

          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-8 w-8 items-center justify-center rounded border border-white/[0.12] text-slate-300 transition-all hover:border-blue-500/50 hover:text-white active:translate-y-px md:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile menu — every link the desktop dropdowns hold, in one scrollable sheet. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/[0.06] bg-[#050509]/98 px-6 pb-10 pt-4 backdrop-blur-md md:hidden"
      >
        <div className="grid grid-cols-2 gap-2">
          {topLinks.filter(item => item.href !== '/tools').map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-slate-200 hover:border-blue-500/40 hover:bg-blue-500/10"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/tools"
            onClick={() => setOpen(false)}
            className="col-span-2 rounded border border-blue-500/40 bg-blue-500/10 px-3 py-2.5 text-sm font-medium text-slate-100 hover:bg-blue-500/20"
          >
            All tools, one table →
          </a>
        </div>
        {[
          { title: 'Free', links: freeLinks },
          { title: 'Projects', links: productLinks },
          { title: 'Learn', links: learnLinks },
        ].map(group => (
          <div key={group.title} className="mt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">{group.title}</p>
            <ul className="mt-2 divide-y divide-white/[0.04] rounded border border-white/[0.06]">
              {group.links.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`block px-3 py-2.5 text-sm hover:bg-blue-500/10 hover:text-slate-100 ${link.hub ? 'text-blue-300' : 'text-slate-300'}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <RailTicker />
    </nav>
  );
}
