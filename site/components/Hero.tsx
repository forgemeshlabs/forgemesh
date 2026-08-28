'use client';

import { MeshBackground } from './MeshBackground';
import { RailPulse } from './RailPulse';
import { RepoWatchStrip } from './RepoWatch';
import { ForgeMeshMark } from './ForgeMeshMark';

export function Hero() {
  // Top-anchored with fixed padding: the hero grew past viewport height when
  // Rail Pulse moved in, and justify-center was shoving the wordmark up behind
  // the fixed nav + ticker.
  return (
    <section className="relative flex flex-col items-center justify-start overflow-hidden pt-32 pb-6 sm:pt-36">
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
            <span className="sr-only"> — paid APIs for AI agents, on every payment rail</span>
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
          A live network of paid APIs that AI agents pay per call — x402, MPP,
          and whatever rail comes next — plus the field research we publish
          from running them. No accounts, no API keys.
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

        {/* Rail Pulse — real-world rail data above the fold (operator, 2026-08-26).
            Terminal graphic retired 2026-08-26 (operator: "it's served its time"). */}
        <div className="w-full">
          <RailPulse embedded />
          <RepoWatchStrip />
        </div>
      </div>

    </section>
  );
}
