'use client';

import { useEffect, useState } from 'react';

// Umami's tracker skips all collection on a browser where
// localStorage['umami.disabled'] is set. This page flips that flag so the
// operator's own devices never show up in the stats.
export function NoTrackClient() {
  const [disabled, setDisabled] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setDisabled(!!localStorage.getItem('umami.disabled'));
    } catch {
      setDisabled(false);
    }
  }, []);

  function toggle() {
    try {
      if (disabled) localStorage.removeItem('umami.disabled');
      else localStorage.setItem('umami.disabled', '1');
      setDisabled(!disabled);
    } catch {
      /* storage unavailable — nothing to do */
    }
  }

  if (disabled === null) return null;

  return (
    <div className="mx-auto max-w-md rounded border border-white/[0.08] bg-white/[0.02] p-8 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
        Analytics opt-out
      </p>
      <p className="mt-4 text-2xl font-semibold text-slate-50">
        {disabled ? 'This browser is invisible' : 'This browser is being counted'}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-400">
        {disabled
          ? 'Visits from this browser are excluded from ForgeMesh analytics. Repeat this on each browser and device you use.'
          : 'Tap the button to exclude this browser from ForgeMesh analytics. Do this once per browser and device you use.'}
      </p>
      <button
        onClick={toggle}
        className={
          disabled
            ? 'mt-6 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white'
            : 'mt-6 rounded border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-emerald-400/70 hover:bg-emerald-500/20'
        }
      >
        {disabled ? 'Re-enable counting' : 'Stop counting me'}
      </button>
    </div>
  );
}
