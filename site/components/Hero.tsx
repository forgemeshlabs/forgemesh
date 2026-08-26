'use client';

import { MeshBackground } from './MeshBackground';
import { RailPulse } from './RailPulse';
import { ForgeMeshMark } from './ForgeMeshMark';

const terminalLines = [
  { prefix: '$ ', text: 'forgemesh init --agent coinopai-mcp', delay: 0 },
  { prefix: '-> ', text: 'Connecting people, agents, and systems...', delay: 600 },
  { prefix: '-> ', text: 'x402 payment layer: active', delay: 1100 },
  { prefix: '-> ', text: 'Active systems indexed', delay: 1600 },
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
            <span className="sr-only"> — paid x402 APIs for AI agents on Base</span>
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
          A live network of paid x402 APIs on Base — services AI agents pay per
          call in USDC, plus the field research we publish from running them.
          No accounts, no API keys.
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

        {/* Rail Pulse — real-world rail data above the fold (operator, 2026-08-26) */}
        <div className="mb-10 w-full">
          <RailPulse embedded />
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
