'use client';

import { MeshBackground } from './MeshBackground';
import { ForgeMeshMark } from './ForgeMeshMark';

const terminalLines = [
  { prefix: '$ ', text: 'forgemesh init --agent coinopai-mcp', delay: 0 },
  { prefix: '-> ', text: 'Connecting people, agents, and systems...', delay: 600 },
  { prefix: '-> ', text: 'x402 payment layer: active', delay: 1100 },
  { prefix: '-> ', text: 'MCP packages indexed (4)', delay: 1600 },
  { prefix: 'OK ', text: 'Mesh ready for collaboration', delay: 2100, accent: true },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 sm:pt-0">
      <MeshBackground />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(59,130,246,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Headline */}
        <div className="mb-5 flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-1">
          <ForgeMeshMark size={88} className="hero-mark" />
          <h1 className="hero-wordmark text-5xl sm:text-6xl lg:text-7xl leading-[1.08]">
            ForgeMesh
          </h1>
        </div>

        {/* Vision */}
        <p className="hero-vision text-2xl sm:text-3xl lg:text-4xl leading-tight mb-7">
          Building for the{' '}
          <span
            className="hero-vision-accent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #67e8f9 0%, #93c5fd 48%, #c4b5fd 100%)',
            }}
          >
            Autonomous Agent Economy
          </span>
        </p>

        {/* Mission */}
        <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed mb-10">
          ForgeMesh connects people, agents, and systems to create what none could
          build alone.
        </p>

        <a
          href="#philosophy"
          className="inline-flex items-center gap-2 mb-10 text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors"
        >
          Every Builder Belongs
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 3v10M4 9l4 4 4-4" />
          </svg>
        </a>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#systems"
            className="inline-flex items-center gap-2 px-6 py-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all hover:shadow-[0_0_24px_rgba(59,130,246,0.4)]"
          >
            Explore the Mesh
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
          <a
            href="https://github.com/forgemeshlabs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded border border-white/[0.12] text-slate-300 hover:border-white/25 hover:text-white font-medium text-sm transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            Build With Us
          </a>
        </div>

        {/* Terminal snippet */}
        <div
          className="mx-auto max-w-lg rounded-lg overflow-hidden text-left border border-white/[0.08]"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            <span className="ml-2 text-xs text-slate-500 font-mono">forgemesh terminal</span>
          </div>
          <div className="p-4 space-y-1.5">
            {terminalLines.map((line, i) => (
              <div key={i} className="flex gap-2 font-mono text-xs">
                <span className={line.accent ? 'text-green-400' : 'text-blue-400'}>
                  {line.prefix}
                </span>
                <span className={line.accent ? 'text-green-300' : 'text-slate-300'}>
                  {line.text}
                </span>
              </div>
            ))}
            <div className="flex gap-2 font-mono text-xs">
              <span className="text-blue-400">$ </span>
              <span className="text-slate-300">
                _
                <span className="inline-block w-1.5 h-3 bg-slate-300 ml-0.5 align-text-bottom animate-blink" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg viewBox="0 0 16 24" className="w-4 h-6 animate-float" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="1" width="14" height="22" rx="7" />
          <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
        </svg>
      </div>
    </section>
  );
}
