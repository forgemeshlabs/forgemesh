'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
} from 'framer-motion';

// ─── Data ────────────────────────────────────────────────────────────────────

const PARALLELS = [
  { web: 'robots.txt',       agent: 'machine discovery manifests' },
  { web: 'sitemap.xml',      agent: 'service capability maps'     },
  { web: 'SEO',              agent: 'agent discoverability'       },
  { web: 'Googlebot',        agent: 'payment-aware crawlers'      },
  { web: 'web monetization', agent: 'machine micropayments'       },
];

const WEB_NODES   = ['robots.txt', 'sitemap.xml', 'meta tags', 'link graph'];
const AGENT_NODES = ['/.well-known/x402', '/openapi.json', '/llms.txt', 'MCP manifest'];

// ─── 3D Node Graph ───────────────────────────────────────────────────────────

function NodeGraph() {
  const W = 720, H = 260;
  const lx = 150, rx = W - 150;
  const ys = [50, 105, 160, 215];

  const connections = [
    [0, 0], [0, 1],
    [1, 1], [1, 2],
    [2, 2], [2, 3],
    [3, 3], [3, 0],
  ];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full max-w-2xl mx-auto"
      style={{ filter: 'drop-shadow(0 0 24px rgba(59,130,246,0.12))' }}
    >
      <defs>
        <radialGradient id="glow-blue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <filter id="blur-sm">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      {/* Connection lines */}
      {connections.map(([wi, ai], i) => {
        const x1 = lx + 8, y1 = ys[wi];
        const x2 = rx - 8, y2 = ys[ai];
        const len = Math.hypot(x2 - x1, y2 - y1);
        return (
          <motion.line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(59,130,246,0.18)"
            strokeWidth="1"
            strokeDasharray={`${len}`}
            initial={{ strokeDashoffset: len }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.6, delay: 0.4 + i * 0.12, ease: 'easeOut' }}
          />
        );
      })}

      {/* Animated probe dots */}
      {connections.slice(0, 4).map(([wi, ai], i) => {
        const x1 = lx + 8, y1 = ys[wi];
        const x2 = rx - 8, y2 = ys[ai];
        return (
          <motion.circle
            key={`dot-${i}`}
            r="2.5"
            fill="#3b82f6"
            initial={{ cx: x1, cy: y1, opacity: 0 }}
            animate={{
              cx: [x1, x2],
              cy: [y1, y2],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.2,
              delay: 1.2 + i * 0.55,
              repeat: Infinity,
              repeatDelay: 1.8,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {/* Web nodes (left) */}
      {WEB_NODES.map((label, i) => (
        <g key={`w-${i}`}>
          <motion.circle
            cx={lx} cy={ys[i]} r="7"
            fill="#0a0a14" stroke="rgba(255,255,255,0.12)" strokeWidth="1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
          />
          <motion.text
            x={lx - 14} y={ys[i] + 4}
            textAnchor="end"
            fontSize="13"
            fontFamily="var(--font-geist-mono, monospace)"
            fill="rgba(148,163,184,0.6)"
            initial={{ opacity: 0, x: lx - 6 }}
            animate={{ opacity: 1, x: lx - 14 }}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            {label}
          </motion.text>
        </g>
      ))}

      {/* Agent nodes (right) */}
      {AGENT_NODES.map((label, i) => (
        <g key={`a-${i}`}>
          <motion.circle
            cx={rx} cy={ys[i]} r="7"
            fill="#0a0a18"
            stroke="rgba(59,130,246,0.5)"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
          />
          {/* Outer ring pulse */}
          <motion.circle
            cx={rx} cy={ys[i]} r="7"
            fill="none"
            stroke="rgba(59,130,246,0.3)"
            strokeWidth="1"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.text
            x={rx + 14} y={ys[i] + 4}
            textAnchor="start"
            fontSize="13"
            fontFamily="var(--font-geist-mono, monospace)"
            fill="rgba(147,197,253,0.7)"
            initial={{ opacity: 0, x: rx + 6 }}
            animate={{ opacity: 1, x: rx + 14 }}
            transition={{ delay: 0.4 + i * 0.08 }}
          >
            {label}
          </motion.text>
        </g>
      ))}

      {/* Era labels */}
      <motion.text
        x={lx} y={H - 6}
        textAnchor="middle"
        fontSize="11"
        fontFamily="var(--font-geist-mono, monospace)"
        fill="rgba(148,163,184,0.35)"
        letterSpacing="3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        WEB ERA
      </motion.text>
      <motion.text
        x={rx} y={H - 6}
        textAnchor="middle"
        fontSize="11"
        fontFamily="var(--font-geist-mono, monospace)"
        fill="rgba(147,197,253,0.45)"
        letterSpacing="3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        AGENT ERA
      </motion.text>
    </svg>
  );
}

// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rX = useTransform(my, [-0.5, 0.5], [7, -7]);
  const rY = useTransform(mx, [-0.5, 0.5], [-7, 7]);
  const sX = useSpring(rX, { stiffness: 280, damping: 28 });
  const sY = useSpring(rY, { stiffness: 280, damping: 28 });

  const glowX = useTransform(mx, [-0.5, 0.5], ['30%', '70%']);
  const glowY = useTransform(my, [-0.5, 0.5], ['30%', '70%']);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 900 }}
      className="cursor-default"
    >
      <motion.div
        style={{ rotateX: sX, rotateY: sY, transformStyle: 'preserve-3d' }}
        className="relative rounded-xl border border-white/[0.07] bg-[#080810] overflow-hidden"
      >
        {/* Animated spotlight following mouse */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) =>
                `radial-gradient(ellipse 55% 45% at ${gx} ${gy}, rgba(59,130,246,0.06) 0%, transparent 70%)`
            ),
          }}
        />
        {/* Scan line */}
        <motion.div
          className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
          initial={{ top: '0%', opacity: 0 }}
          animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
        />
        {/* Depth layer indicator */}
        <div
          className="absolute inset-0 rounded-xl border border-blue-500/5"
          style={{ transform: 'translateZ(-8px)' }}
        />
        {children}
      </motion.div>
    </div>
  );
}

// ─── Paragraph reveal ────────────────────────────────────────────────────────

function RevealParagraph({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function Discovery() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [activeRow, setActiveRow] = useState<number | null>(null);

  return (
    <section
      id="discovery"
      ref={sectionRef}
      className="relative pt-4 pb-16 px-6 overflow-hidden bg-[#050509]"
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.8) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Top edge fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#050509] to-transparent pointer-events-none" />
      {/* Bottom edge fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050509] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Label */}
        <motion.p
          className="text-xs tracking-widest uppercase text-blue-400/60 mb-10 font-mono"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          Machine Discovery
        </motion.p>

        {/* Opening hook */}
        <div className="mb-16 space-y-1">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-medium text-slate-200 leading-[1.15] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            The web taught humans how to discover information.
          </motion.h2>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-medium leading-[1.15] tracking-tight"
            style={{ color: 'rgba(148,163,184,0.45)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            What's forming now may teach machines how to discover services.
          </motion.h2>
        </div>

        {/* Context */}
        <div className="mb-16 space-y-5 max-w-2xl">
          <RevealParagraph delay={0.1}>
            <p className="text-lg text-slate-400 leading-relaxed">
              In the early internet, Google crawlers learned to read robots.txt, sitemaps, metadata,
              links, and structured pages. Those conventions became the foundation of modern SEO —
              invisible infrastructure that shaped how the world finds information.
            </p>
          </RevealParagraph>
          <RevealParagraph delay={0.15}>
            <p className="text-lg text-slate-400 leading-relaxed">
              A similar pattern is beginning to emerge for autonomous agents. Instead of indexing
              webpages for humans, new crawlers are probing APIs, MCP servers, OpenAPI specs, and
              x402 payment endpoints to understand what services exist, what they cost, how they
              authenticate, and whether machines can transact with them autonomously.
            </p>
          </RevealParagraph>
        </div>

        {/* Node graph */}
        <RevealParagraph delay={0.05}>
          <div className="mb-16 rounded-xl border border-white/[0.06] bg-[#080810] p-6 sm:p-10">
            <p className="text-xs font-mono text-blue-400/40 tracking-widest uppercase mb-8">
              Probe map — agent crawlers vs. canonical endpoints
            </p>
            <NodeGraph />
          </div>
        </RevealParagraph>

        {/* Parallels — 3D tilt card */}
        <RevealParagraph delay={0.1}>
          <div className="mb-16">
            <p className="text-xs font-mono text-slate-600 tracking-widest uppercase mb-6">
              The parallels are striking
            </p>
            <TiltCard>
              <div className="divide-y divide-white/[0.05]">
                {/* Header */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-3">
                  <span className="text-xs font-mono text-slate-600 tracking-widest uppercase">Web era</span>
                  <span className="text-xs font-mono text-slate-700 px-6">→</span>
                  <span className="text-xs font-mono text-blue-400/50 tracking-widest uppercase">Agent era</span>
                </div>
                {PARALLELS.map((row, i) => (
                  <motion.div
                    key={i}
                    className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4 transition-colors"
                    style={{
                      background: activeRow === i ? 'rgba(59,130,246,0.04)' : 'transparent',
                    }}
                    onHoverStart={() => setActiveRow(i)}
                    onHoverEnd={() => setActiveRow(null)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.07, duration: 0.4 }}
                  >
                    <span className={`text-base font-mono transition-colors duration-200 ${activeRow === i ? 'text-slate-300' : 'text-slate-500'}`}>
                      {row.web}
                    </span>
                    <div className="px-6 flex items-center">
                      <motion.div
                        className="h-px bg-gradient-to-r from-slate-600 via-blue-500/60 to-blue-500/30"
                        style={{ width: 40 }}
                        animate={activeRow === i
                          ? { scaleX: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }
                          : { scaleX: 1, opacity: 0.3 }
                        }
                        transition={{ duration: 1.5, repeat: activeRow === i ? Infinity : 0 }}
                      />
                    </div>
                    <span className={`text-base font-mono transition-colors duration-200 ${activeRow === i ? 'text-blue-300' : 'text-slate-600'}`}>
                      {row.agent}
                    </span>
                  </motion.div>
                ))}
              </div>
            </TiltCard>
          </div>
        </RevealParagraph>

        {/* Closing */}
        <div className="max-w-2xl space-y-5">
          <RevealParagraph delay={0.1}>
            <p className="text-lg text-slate-400 leading-relaxed">
              The ecosystem is still primitive, fragmented, and experimental. But the patterns are
              recognizable to anyone who watched the early web form its own conventions.
            </p>
          </RevealParagraph>
          <RevealParagraph delay={0.2}>
            <blockquote className="border-l-2 border-blue-500/30 pl-5">
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
                We may be watching the earliest formation of machine-native discovery infrastructure —
                where agents, not humans, become the primary consumers of APIs, tools, and services.
              </p>
            </blockquote>
          </RevealParagraph>
          <RevealParagraph delay={0.3}>
            <p className="text-xs font-mono text-slate-700 tracking-widest uppercase pt-4">
              Conventions become infrastructure. Infrastructure becomes gravity.
            </p>
          </RevealParagraph>
          <RevealParagraph delay={0.4}>
            <div className="pt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.05]" />
              <a
                href="https://aitinkers.fun"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-xs font-mono text-slate-700 hover:text-slate-400 transition-colors duration-300"
              >
                <span className="tracking-widest uppercase">Field Notes from the frontier</span>
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                >
                  <path d="M3 13L13 3M13 3H7M13 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>
          </RevealParagraph>
        </div>

      </div>
    </section>
  );
}
