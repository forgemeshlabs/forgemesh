// Serves files from content/assets/ at request time — the runtime companion to
// public/ for anything added after the last build (post heroes, pin cards).
// public/ is frozen at build; this route reads disk per request.
import fs from 'fs';
import { assetPath } from '@/lib/runtime-blog';

export const dynamic = 'force-dynamic';

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  // Only /content/assets/* is exposed; posts/ and registry.json stay private.
  if (
    segments?.[0] !== 'assets' ||
    segments.length < 2 ||
    segments.some((s) => !/^[\w.-]+$/.test(s))
  ) {
    return new Response('Not found', { status: 404 });
  }
  const file = assetPath(...segments.slice(1));
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    return new Response('Not found', { status: 404 });
  }
  const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
  return new Response(fs.readFileSync(file), {
    headers: {
      'content-type': MIME[ext] || 'application/octet-stream',
      'cache-control': 'public, max-age=300',
    },
  });
}
