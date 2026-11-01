'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Cloudflare Turnstile widget. Posts its token as the `cf-turnstile-response` form field,
 * which kit.forgemesh.io/subscribe verifies server-side. Renders nothing when no site key
 * is configured, so a missing key degrades to the old (unprotected) form instead of breaking it.
 */
export function Turnstile({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const render = useCallback(() => {
    if (!SITE_KEY || !host.current || widgetId.current || !window.turnstile) return;
    widgetId.current = window.turnstile.render(host.current, {
      sitekey: SITE_KEY,
      theme: 'dark',
      size: 'flexible',
    });
  }, []);

  useEffect(() => {
    render();
    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [render]);

  if (!SITE_KEY) return null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={render}
        onReady={render}
      />
      <div ref={host} className={className} />
    </>
  );
}

/** Hidden field real visitors never fill; the subscribe endpoint silently drops submissions that do. */
export function Honeypot() {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute left-[-9999px] h-px w-px opacity-0"
    />
  );
}
