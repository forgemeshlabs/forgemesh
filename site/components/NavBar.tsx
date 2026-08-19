'use client';

import { useState, useEffect } from 'react';
import { ForgeMeshMark } from './ForgeMeshMark';
import { RailTicker } from './RailTicker';

// Reference/explainer pages, folded into one "Learn" dropdown to keep the
// top level short (operator request, 2026-08-19).
const learnLinks = [
  { label: 'What is x402?', href: '/x402' },
  { label: 'MCP servers', href: '/#mcp' },
  { label: 'Philosophy', href: '/#philosophy' },
  { label: 'Discovery', href: '/#discovery' },
];

const productLinks = [
  { label: 'All project cards', href: '/#projects' },
  { label: 'BotBoard', href: '/botboard' },
  { label: 'SEO Authority API', href: '/seo' },
  { label: 'Library', href: 'https://library.forgemesh.io' },
  { label: 'x402 Utility APIs', href: 'https://x402.forgemesh.io' },
  { label: 'x402 Proxy', href: 'https://proxy.forgemesh.io' },
  { label: 'Voice', href: 'https://voice.forgemesh.io' },
  { label: 'Disruption Intel', href: 'https://disruption.forgemesh.io' },
  { label: 'Anomaly Tracker', href: 'https://anomaly.forgemesh.io' },
  { label: 'Ads', href: 'https://ads.forgemesh.io' },
  { label: 'Travel Agent', href: 'https://travel-agent.forgemesh.io' },
  { label: 'Notary', href: 'https://notary.forgemesh.io' },
  { label: 'CoinOpAI API', href: 'https://x402.coinopai.com' },
  { label: 'ImageGen', href: 'https://imagegen.coinopai.com' },
  { label: 'ClawVoice', href: '/clawvoice' },
];

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
            { label: 'Blog', href: '/blog' },
            { label: 'The Brief', href: '/brief' },
            { label: 'Texas Watch', href: '/texas' },
          ].map(item => (
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
                  className="block rounded px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-blue-500/10 hover:text-slate-100 focus:bg-blue-500/10 focus:text-slate-100 focus:outline-none"
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
                  className="block rounded px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-blue-500/10 hover:text-slate-100 focus:bg-blue-500/10 focus:text-slate-100 focus:outline-none"
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
        </div>
      </div>
      <RailTicker />
    </nav>
  );
}
