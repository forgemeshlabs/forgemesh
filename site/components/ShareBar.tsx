'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Share2, Check, Link2 } from 'lucide-react';

// Compact share row rendered above the footer on content pages.
// Builds intent URLs client-side from the canonical page URL + document title.
export function ShareBar() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const pageUrl = `https://forgemesh.io${pathname}`;
  const title = () => (typeof document !== 'undefined' ? document.title.replace(/ \| ForgeMesh Labs$/, '') : 'ForgeMesh Labs');

  const targets = [
    { label: 'X', href: () => `https://x.com/intent/post?text=${encodeURIComponent(title())}&url=${encodeURIComponent(pageUrl)}` },
    { label: 'LinkedIn', href: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}` },
    { label: 'Reddit', href: () => `https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(title())}` },
    { label: 'HN', href: () => `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(pageUrl)}&t=${encodeURIComponent(title())}` },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <div className="border-t border-white/[0.06] px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2">
        <span className="mr-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
          <Share2 className="h-3.5 w-3.5" aria-hidden /> Share
        </span>
        {targets.map((t) => (
          <a
            key={t.label}
            href={t.href()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // recompute at click time so document.title is final
              (e.currentTarget as HTMLAnchorElement).href = t.href();
            }}
            className="rounded border border-white/[0.1] px-3 py-1.5 text-xs text-slate-400 transition-all hover:border-blue-500/50 hover:text-slate-100"
          >
            {t.label}
          </a>
        ))}
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 rounded border border-white/[0.1] px-3 py-1.5 text-xs text-slate-400 transition-all hover:border-blue-500/50 hover:text-slate-100"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden /> : <Link2 className="h-3.5 w-3.5" aria-hidden />}
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
