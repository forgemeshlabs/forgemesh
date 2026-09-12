// x402 Verified by ForgeMesh — canonical multi-cell SVG badge.
// Cells: [label][score][optional ★][optional $]. Each mark keeps its own fixed color —
// no mark ever changes another mark's color (operator spec, 2026-09-11).
// Unknown/invalid slugs still return 200 with a grey "not listed" badge because GitHub's
// camo image proxy drops non-2xx responses, which would otherwise break every embed.
import { findSeller, isSlug, badgeFor, GOLD_COLOR, PAID_COLOR } from '@/lib/verified';
import { loadVerified } from '@/lib/verified-data';

export const dynamic = 'force-dynamic';

const LABEL = 'x402 Verified by ForgeMesh';
const LABEL_COLOR = '555555';
const NOT_LISTED_COLOR = '9f9f9f';
const HEIGHT = 20;
const FONT_SIZE = 11;
const CHAR_W = 6.5; // approx Verdana/DejaVu Sans width per glyph at 11px
const PAD_X = 6;

type Cell = { text: string; fill: string };

function cellWidth(text: string): number {
  return Math.max(20, Math.ceil(text.length * CHAR_W) + PAD_X * 2);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderBadge(cells: Cell[], title: string, desc: string): string {
  const widths = cells.map((c) => cellWidth(c.text));
  const total = widths.reduce((a, b) => a + b, 0);
  let x = 0;
  const rects: string[] = [];
  const texts: string[] = [];
  for (let i = 0; i < cells.length; i++) {
    const w = widths[i];
    rects.push(`<rect x="${x}" width="${w}" height="${HEIGHT}" fill="#${cells[i].fill}"/>`);
    const cx = x + w / 2;
    const textLen = Math.max(1, cells[i].text.length * (CHAR_W - 0.6));
    texts.push(
      `<text x="${cx}" y="14.5" fill="#010101" fill-opacity=".3" textLength="${textLen}">${escapeXml(cells[i].text)}</text>` +
        `<text x="${cx}" y="13.5" textLength="${textLen}">${escapeXml(cells[i].text)}</text>`,
    );
    x += w;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${HEIGHT}" role="img" aria-label="${escapeXml(title)}">
<title>${escapeXml(title)}</title>
<desc>${escapeXml(desc)}</desc>
<linearGradient id="s" x2="0" y2="100%">
<stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
<stop offset="1" stop-opacity=".1"/>
</linearGradient>
<clipPath id="r"><rect width="${total}" height="${HEIGHT}" rx="3" fill="#fff"/></clipPath>
<g clip-path="url(#r)">
${rects.join('\n')}
<rect width="${total}" height="${HEIGHT}" fill="url(#s)"/>
</g>
<g fill="#fff" text-anchor="middle" font-family="Verdana,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="${FONT_SIZE}">
${texts.join('\n')}
</g>
</svg>`;
}

function svgHeaders() {
  return {
    'content-type': 'image/svg+xml; charset=utf-8',
    'cache-control': 'public, max-age=300, stale-while-revalidate=86400, stale-if-error=86400',
    'access-control-allow-origin': '*',
  };
}

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;

  if (!isSlug(slug)) {
    const svg = renderBadge(
      [{ text: LABEL, fill: LABEL_COLOR }, { text: 'not listed', fill: NOT_LISTED_COLOR }],
      'x402 Verified by ForgeMesh: not listed',
      `${slug} is not a listed x402 Verified seller.`,
    );
    return new Response(svg, { status: 200, headers: svgHeaders() });
  }

  const feed = loadVerified();
  const seller = findSeller(feed, slug);

  if (!seller) {
    const svg = renderBadge(
      [{ text: LABEL, fill: LABEL_COLOR }, { text: 'not listed', fill: NOT_LISTED_COLOR }],
      'x402 Verified by ForgeMesh: not listed',
      `${slug} is not a listed x402 Verified seller.`,
    );
    return new Response(svg, { status: 200, headers: svgHeaders() });
  }

  const b = badgeFor(seller);
  const cells: Cell[] = [{ text: LABEL, fill: LABEL_COLOR }, { text: b.scoreText, fill: b.scoreColor }];
  if (b.perfect) cells.push({ text: '★', fill: GOLD_COLOR });
  if (b.paid) cells.push({ text: '$', fill: PAID_COLOR });

  const scoreSentence =
    seller.status === 'delisted'
      ? `${seller.name} is delisted from x402 Verified by ForgeMesh.`
      : `${seller.name} scores ${seller.score}/100 on the ForgeMesh Verified Score.`;
  const paidSentence = b.paid
    ? 'ForgeMesh has independently completed and verified a real x402 transaction with this seller.'
    : 'ForgeMesh has not yet transacted with this seller.';
  const perfectSentence = b.perfect
    ? 'This seller currently scores a Perfect 100/100.'
    : 'This seller has not reached a Perfect score.';
  const statusSentence = `Current status: ${seller.status}.`;
  const desc = [scoreSentence, paidSentence, perfectSentence, statusSentence].join(' ');

  const svg = renderBadge(cells, `x402 Verified by ForgeMesh: ${seller.name}`, desc);
  return new Response(svg, { status: 200, headers: svgHeaders() });
}
