// OAuth callback catcher. Third-party authorize flows (X/Twitter, etc.)
// redirect here; we persist the short-lived ?code + ?state to a local file
// (data/, 0600, not web-served) so a CLI poller on this box can complete the
// token exchange before the code expires. The code alone is useless without
// the app's client secret + the PKCE verifier held by the CLI.
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return new NextResponse(page('❌ Authorization was denied or failed', `Provider said: ${escapeHtml(error)}. Close this tab and retry the flow.`), {
      status: 400,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }
  if (!code || !state) {
    return new NextResponse('Missing code/state', { status: 400 });
  }
  const file = path.join(process.cwd(), 'data', 'x-callback.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ code, state, ts: Date.now() }), { mode: 0o600 });
  return new NextResponse(page('✅ Authorized', 'You can close this tab — the server picks it up automatically.'), {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

function page(title: string, body: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family:system-ui,sans-serif;background:#050509;color:#e2e8f0;display:grid;place-items:center;min-height:100vh;margin:0">
<div style="text-align:center"><h1>${title}</h1><p style="color:#94a3b8">${body}</p></div></body></html>`;
}
