'use client';

import { useRef, useState } from 'react';

// Install command + copy button for the homepage MCP table. Uses the async
// clipboard API when available (needs a secure context) and falls back to a
// hidden textarea + execCommand; if both fail the label says so and the
// command text stays selectable.
export function CopyInstall({ command, pkg }: { command: string; pkg: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = (s: 'copied' | 'failed') => {
    setState(s);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 1800);
  };

  const fallbackCopy = () => {
    try {
      const ta = document.createElement('textarea');
      ta.value = command;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };

  const copy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(command);
        flash('copied');
        return;
      }
    } catch {
      /* fall through to the legacy path */
    }
    flash(fallbackCopy() ? 'copied' : 'failed');
  };

  return (
    <div className="flex items-center gap-2 min-w-0">
      <code className="truncate select-all" title={command}>{command}</code>
      <button
        type="button"
        onClick={copy}
        data-umami-event="mcp-copy-install"
        data-umami-event-package={pkg}
        aria-label={`Copy install command for ${pkg}`}
        className="shrink-0 rounded border border-white/[0.12] px-2 py-0.5 text-[11px] font-mono text-slate-400 transition-colors hover:border-blue-400/60 hover:text-slate-100"
      >
        <span aria-live="polite">{state === 'copied' ? 'copied' : state === 'failed' ? 'press ⌘/Ctrl+C' : 'copy'}</span>
      </button>
    </div>
  );
}
