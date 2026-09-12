'use client';

// Copy-to-clipboard badge markdown for a seller's /partners/<slug> page, same pattern as
// ShareBar's copy-link button. Shows a live preview of the canonical SVG badge and offers
// the shields.io endpoint JSON as the zero-infra fallback.
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function VerifiedBadgeSnippet({ slug }: { slug: string }) {
  const [copied, setCopied] = useState<'md' | 'shields' | null>(null);

  const badgeUrl = `https://forgemesh.io/badge/x402/${slug}`;
  const pageUrl = `https://forgemesh.io/partners/${slug}`;
  const shieldsUrl = `https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/forgemeshlabs/x402-verified/main/badges/${slug}.json`;
  const markdown = `[![x402 Verified by ForgeMesh](${badgeUrl})](${pageUrl})`;

  async function copy(text: string, which: 'md' | 'shields') {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <div className="rounded border border-white/[0.08] bg-white/[0.02] p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">README badge</p>

      {/* eslint-disable-next-line @next/next/no-img-element -- external, server-rendered SVG, not a Next-optimizable asset */}
      <img src={badgeUrl} alt={`x402 Verified by ForgeMesh badge for ${slug}`} className="mt-3 h-6" width={240} height={20} />

      <div className="mt-4">
        <p className="text-xs text-slate-500">Markdown (canonical badge)</p>
        <div className="mt-1.5 flex items-start gap-2">
          <code className="min-w-0 flex-1 overflow-x-auto rounded border border-white/[0.08] bg-black/30 px-3 py-2 font-mono text-xs text-slate-300">
            {markdown}
          </code>
          <button
            onClick={() => copy(markdown, 'md')}
            className="inline-flex shrink-0 items-center gap-1.5 rounded border border-white/[0.1] px-3 py-2 text-xs text-slate-400 transition-all hover:border-blue-500/50 hover:text-slate-100"
          >
            {copied === 'md' ? <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
            {copied === 'md' ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-slate-500">shields.io fallback (single-color, zero infra)</p>
        <div className="mt-1.5 flex items-start gap-2">
          <code className="min-w-0 flex-1 overflow-x-auto rounded border border-white/[0.08] bg-black/30 px-3 py-2 font-mono text-xs text-slate-300">
            {shieldsUrl}
          </code>
          <button
            onClick={() => copy(shieldsUrl, 'shields')}
            className="inline-flex shrink-0 items-center gap-1.5 rounded border border-white/[0.1] px-3 py-2 text-xs text-slate-400 transition-all hover:border-blue-500/50 hover:text-slate-100"
          >
            {copied === 'shields' ? <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
            {copied === 'shields' ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
