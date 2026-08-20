// x402 endpoint health scanner — same probe logic as the paid stuffer endpoint
// (~/repos/x402-forgemesh-stuffer/src/handlers/x402scan.js), ported for the site's
// free browser scan and the paid $5 report. Keep the two in sync when grading changes.
import { promises as dns } from 'node:dns';
import net from 'node:net';

const SCAN_TIMEOUT_MS = 8000;
const MAX_BYTES = 64 * 1024;
const ALLOWED_PORTS = new Set(['80', '443', '8080', '8443']);
const USER_AGENT = 'forgemesh-scan/1.0 (+https://forgemesh.io/scan)';

export type ScanResult = {
  url: string;
  reachable: boolean;
  http_status: number | null;
  is_402: boolean;
  x402_envelope: 'header' | 'body' | 'missing';
  envelope_valid: boolean;
  envelope_errors: string[];
  accepts_summary: Array<{ scheme: string | null; network: string | null; asset: string | null; payTo: string | null; amount: string | null }>;
  mpp_dual_stack: boolean;
  method_used: 'GET' | 'POST';
  response_time_ms: number;
  grade: 'A' | 'B' | 'C' | 'F';
  findings: string[];
  service_root_hint?: boolean;
};

export class ScanInputError extends Error {}

function isPrivateIp(ip: string): boolean {
  const low = ip.toLowerCase();
  if (net.isIPv6(low) || low.includes(':')) {
    return (
      low === '::1' || low === '::' || low.startsWith('fe80') || low.startsWith('fc') ||
      low.startsWith('fd') || low.startsWith('::ffff:127.') || low.startsWith('::ffff:10.') ||
      low.startsWith('::ffff:192.168.') || low.startsWith('::ffff:169.254.') ||
      /^::ffff:172\.(1[6-9]|2\d|3[01])\./.test(low)
    );
  }
  return (
    /^127\./.test(ip) || /^10\./.test(ip) || /^192\.168\./.test(ip) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) || /^169\.254\./.test(ip) ||
    ip === '0.0.0.0' || /^0\./.test(ip)
  );
}

export async function validateScanTarget(rawUrl: string): Promise<URL> {
  let u: URL;
  try {
    u = new URL(rawUrl);
  } catch {
    throw new ScanInputError('That does not look like a valid URL.');
  }
  if (!/^https?:$/.test(u.protocol)) throw new ScanInputError('Only http/https URLs can be scanned.');
  const hostname = u.hostname.toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.internal') || hostname.endsWith('.local')) {
    throw new ScanInputError('Local and internal hostnames cannot be scanned.');
  }
  const port = u.port || (u.protocol === 'https:' ? '443' : '80');
  if (!ALLOWED_PORTS.has(port)) throw new ScanInputError(`Port ${port} is not scannable — only 80, 443, 8080, 8443.`);
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) throw new ScanInputError('Private and reserved IP addresses cannot be scanned.');
  } else {
    const address = await dns.lookup(hostname).then((r) => r.address).catch(() => null);
    if (!address) throw new ScanInputError(`DNS resolution failed for ${hostname}.`);
    if (isPrivateIp(address)) throw new ScanInputError('That hostname resolves to a private address — refused.');
  }
  return u;
}

async function readCapped(res: Response, cap: number): Promise<Buffer> {
  const reader = res.body?.getReader();
  if (!reader) {
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length > cap ? buf.subarray(0, cap) : buf;
  }
  const chunks: Buffer[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > cap) {
      chunks.push(Buffer.from(value.subarray(0, value.length - (total - cap))));
      try {
        await reader.cancel();
      } catch {
        /* best effort */
      }
      break;
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}

async function doFetch(url: string, method: 'GET' | 'POST') {
  const res = await fetch(url, {
    method,
    redirect: 'manual',
    signal: AbortSignal.timeout(SCAN_TIMEOUT_MS),
    cache: 'no-store',
    headers: {
      'user-agent': USER_AGENT,
      ...(method === 'POST' ? { 'content-type': 'application/json' } : {}),
    },
    body: method === 'POST' ? '{}' : undefined,
  });
  const body = await readCapped(res, MAX_BYTES);
  return { status: res.status, headers: res.headers, body };
}

function decodeEnvelope(b64: string): { data: unknown; errors: string[] } {
  let json: string;
  try {
    json = Buffer.from(String(b64), 'base64').toString('utf8');
  } catch (e) {
    return { data: null, errors: [`payment-required header is not valid base64: ${(e as Error).message}`] };
  }
  try {
    return { data: JSON.parse(json), errors: [] };
  } catch (e) {
    return { data: null, errors: [`payment-required header decodes but is not valid JSON: ${(e as Error).message}`] };
  }
}

function validateEnvelope(data: unknown) {
  const errors: string[] = [];
  const acceptsSummary: ScanResult['accepts_summary'] = [];
  if (data == null || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: ['envelope is not a JSON object'], acceptsSummary, x402Version: null as number | null };
  }
  const d = data as Record<string, unknown>;
  if (typeof d.x402Version !== 'number') errors.push('envelope missing numeric "x402Version" field');
  if (!Array.isArray(d.accepts) || d.accepts.length === 0) {
    errors.push('envelope missing a non-empty "accepts" array');
  } else {
    for (const a of d.accepts as Array<Record<string, unknown>>) {
      if (!a || typeof a !== 'object') {
        errors.push('accepts[] entry is not an object');
        continue;
      }
      for (const f of ['scheme', 'network', 'asset', 'payTo', 'amount']) {
        if (a[f] == null) errors.push(`accepts[] entry missing "${f}"`);
      }
      acceptsSummary.push({
        scheme: (a.scheme as string) ?? null,
        network: (a.network as string) ?? null,
        asset: (a.asset as string) ?? null,
        payTo: (a.payTo as string) ?? null,
        amount: (a.amount as string) ?? null,
      });
    }
  }
  return { valid: errors.length === 0, errors, acceptsSummary, x402Version: (d.x402Version as number) ?? null };
}

function unreachableResult(url: string, methodUsed: 'GET' | 'POST', startedAt: number, message: string): ScanResult {
  return {
    url,
    reachable: false,
    http_status: null,
    is_402: false,
    x402_envelope: 'missing',
    envelope_valid: false,
    envelope_errors: [],
    accepts_summary: [],
    mpp_dual_stack: false,
    method_used: methodUsed,
    response_time_ms: Date.now() - startedAt,
    grade: 'F',
    findings: [
      `Could not reach the endpoint: ${message}. Agents will fail before payment is even discussed — this endpoint earns zero x402 revenue as configured.`,
    ],
  };
}

export async function runScan(rawUrl: string): Promise<ScanResult> {
  const target = await validateScanTarget(String(rawUrl || '').trim());
  const targetUrl = target.href;

  const t0 = Date.now();
  let methodUsed: 'GET' | 'POST' = 'GET';
  let res: Awaited<ReturnType<typeof doFetch>>;
  try {
    res = await doFetch(targetUrl, 'GET');
  } catch (e) {
    return unreachableResult(targetUrl, methodUsed, t0, (e as Error).message);
  }

  if (res.status === 405) {
    methodUsed = 'POST';
    try {
      res = await doFetch(targetUrl, 'POST');
    } catch (e) {
      return unreachableResult(targetUrl, methodUsed, t0, (e as Error).message);
    }
  }

  const responseTimeMs = Date.now() - t0;
  const httpStatus = res.status;
  const is402 = httpStatus === 402;
  const wwwAuth = res.headers.get('www-authenticate') || '';
  const mppDualStack = /^\s*payment\b/i.test(wwwAuth);

  let envelopeSource: ScanResult['x402_envelope'] = 'missing';
  let envelopeValid = false;
  let envelopeErrors: string[] = [];
  let acceptsSummary: ScanResult['accepts_summary'] = [];
  let x402Version: number | null = null;

  const headerEnvelopeRaw = res.headers.get('payment-required');
  if (headerEnvelopeRaw) {
    envelopeSource = 'header';
    const { data, errors } = decodeEnvelope(headerEnvelopeRaw);
    if (errors.length) {
      envelopeErrors = errors;
    } else {
      const v = validateEnvelope(data);
      envelopeValid = v.valid;
      envelopeErrors = v.errors;
      acceptsSummary = v.acceptsSummary;
      x402Version = v.x402Version;
    }
  } else {
    const bodyText = res.body.toString('utf8');
    if (bodyText.includes('"x402Version"')) {
      envelopeSource = 'body';
      try {
        const v = validateEnvelope(JSON.parse(bodyText));
        envelopeValid = v.valid;
        envelopeErrors = v.errors;
        acceptsSummary = v.acceptsSummary;
        x402Version = v.x402Version;
      } catch (e) {
        envelopeErrors = [`response body contains "x402Version" but is not valid JSON: ${(e as Error).message}`];
      }
    }
  }

  const findings: string[] = [];
  let grade: ScanResult['grade'];
  let serviceRootHint = false;
  if (!is402) {
    grade = 'F';
    if (httpStatus >= 200 && httpStatus < 300) {
      // A 200 at a service ROOT is usually the manifest/directory page, not a
      // broken paywall — check .well-known/x402 so the finding says so.
      let firstRoute: string | null = null;
      try {
        const wk = await fetch(new URL('/.well-known/x402', targetUrl).href, {
          redirect: 'manual',
          signal: AbortSignal.timeout(4000),
          cache: 'no-store',
          headers: { 'user-agent': USER_AGENT },
        });
        if (wk.ok) {
          const manifest = (await wk.json()) as { resources?: Array<{ resource?: string }> };
          if (Array.isArray(manifest?.resources) && manifest.resources.length > 0) {
            serviceRootHint = true;
            firstRoute = manifest.resources[0]?.resource ?? null;
          }
        }
      } catch {
        /* no manifest — treat as an ordinary free-serving 200 */
      }
      if (serviceRootHint) {
        findings.push(
          `This URL answers HTTP ${httpStatus} with free content, but the host publishes an x402 discovery manifest (/.well-known/x402) — you most likely scanned the service DIRECTORY, not a payable route. That's normal: directories are meant to be free. Scan a specific paid endpoint instead${firstRoute ? `, e.g. ${firstRoute}` : ''}.`,
        );
      } else {
        findings.push(
          `Endpoint returns HTTP ${httpStatus} without requiring payment: your paywall never fires and agents receive your product for free.`,
        );
      }
    } else if ([301, 302, 303, 307, 308].includes(httpStatus)) {
      findings.push(
        `Endpoint returns a redirect (HTTP ${httpStatus}) instead of a 402 challenge — this scan does not follow redirects; point payment-gated agents at the final URL directly, or the paywall never fires for them either.`,
      );
    } else {
      findings.push(
        `Endpoint returned HTTP ${httpStatus}, not the 402 challenge x402 clients look for: standard x402 clients will not recognize this as a paid resource and will treat the request as failed rather than payable.`,
      );
    }
  } else if (envelopeSource === 'missing') {
    grade = 'C';
    findings.push(
      '402 response has no "payment-required" header and no "x402Version" in the body: standard x402 clients cannot construct a payment and will abandon the purchase.',
    );
  } else if (!envelopeValid) {
    grade = 'C';
    findings.push(
      `402 response includes an x402 envelope in the ${envelopeSource} but it fails validation (${envelopeErrors.join('; ')}): agents that strictly parse the envelope will reject this offer instead of paying it.`,
    );
  } else {
    grade = mppDualStack ? 'A' : 'B';
    findings.push(
      `Valid x402 v${x402Version} envelope found in the ${envelopeSource}${envelopeSource === 'body' ? " — some x402 client libraries only check the payment-required header and will miss an envelope that's only in the body" : ''}.`,
    );
    if (mppDualStack) {
      findings.push(
        'WWW-Authenticate: Payment header also present — this endpoint speaks both x402 and MPP dual-stack, reaching agents on either payment stack.',
      );
    } else {
      findings.push(
        "No WWW-Authenticate: Payment challenge found — agents that only speak the newer Machine Payments Protocol (MPP) won't recognize this as payable, though x402-native clients will.",
      );
    }
  }
  if (methodUsed === 'POST') {
    findings.push(
      'GET returned 405 Method Not Allowed; retried with POST — confirm your paywall middleware also covers GET in case a client agent tries the simpler verb first.',
    );
  }

  return {
    url: targetUrl,
    reachable: true,
    http_status: httpStatus,
    is_402: is402,
    x402_envelope: envelopeSource,
    envelope_valid: envelopeValid,
    envelope_errors: envelopeErrors,
    accepts_summary: acceptsSummary,
    mpp_dual_stack: mppDualStack,
    method_used: methodUsed,
    response_time_ms: responseTimeMs,
    grade,
    findings,
    ...(serviceRootHint ? { service_root_hint: true } : {}),
  };
}

// ————— Fix guidance for the paid report —————
export type FixGuide = { title: string; body: string; snippet?: string };

export function fixGuides(r: ScanResult): FixGuide[] {
  const guides: FixGuide[] = [];
  if (!r.reachable) {
    guides.push({
      title: 'Bring the endpoint back online at its listed URL',
      body: 'Your Bazaar listing points agents at this exact URL. If the service moved, update the resource URL in your discovery manifest (.well-known/x402) and re-verify with the facilitator — a listing pointing at a dead URL costs you every attempted purchase silently. Check DNS, TLS certificate validity, and that your reverse proxy actually routes this path.',
    });
    return guides;
  }
  if (r.service_root_hint) {
    guides.push({
      title: 'Scan a payable route, not the service directory',
      body: 'The URL you scanned is your service’s directory/manifest page — it is SUPPOSED to be free, so the F here is about the wrong target, not a broken paywall. Pick a specific paid route from your /.well-known/x402 manifest and scan that instead; this report page will re-check whatever URL was purchased, so run a fresh scan on the right route from forgemesh.io/scan.',
    });
    return guides;
  }
  if (!r.is_402 && r.http_status && r.http_status >= 200 && r.http_status < 300) {
    guides.push({
      title: 'Your paywall middleware never fires — fix the middleware order',
      body: 'The single most common cause: the route was registered before the payment middleware, or the middleware is mounted on a different path prefix than the route. Second most common: the payment middleware silently disabled itself because an env var (facilitator URL, wallet address, network) failed to load in production. Verify by hitting the route from OUTSIDE your network — internal requests often bypass proxies that strip or reroute.',
      snippet: `// Express: payment middleware MUST come before the route\napp.use(paymentMiddleware({ /* x402 config */ }));  // ← first\napp.post('/your-route', handler);                    // ← then routes\n\n// verify from outside:\ncurl -sD - -o /dev/null https://your-api.com/your-route   # expect: HTTP/2 402`,
    });
  }
  if (!r.is_402 && r.http_status && [301, 302, 303, 307, 308].includes(r.http_status)) {
    guides.push({
      title: 'List the final URL, not the redirect',
      body: 'Most x402 client libraries do not follow redirects before payment — they see a 3xx, not a 402, and give up. Update your Bazaar/manifest resource URL to the post-redirect address (exact scheme, host, and path — including trailing-slash differences, and www vs apex host).',
    });
  }
  if (!r.is_402 && r.http_status === 404) {
    guides.push({
      title: 'The listed path no longer exists on your server',
      body: 'Your discovery listing and your router disagree. Diff the paths in your .well-known/x402 manifest against your actual route table — renamed routes, removed versions (/v1/ vs /v2/), and case differences are the usual culprits. Then wait for the next facilitator crawl or re-register to refresh the listing.',
    });
  }
  if (r.is_402 && r.x402_envelope === 'missing') {
    guides.push({
      title: 'Attach a machine-readable payment envelope to your 402',
      body: 'You return 402, but nothing an agent can parse. The standard: a base64-encoded JSON envelope in the payment-required response header containing x402Version and an accepts[] array (scheme, network, asset, payTo, amount). If you use an x402 middleware library, this is generated for you — a missing envelope usually means the 402 is coming from your own error handler or reverse proxy, not from the x402 middleware.',
      snippet: `// The envelope agents expect (before base64 encoding into the payment-required header):\n{\n  "x402Version": 2,\n  "error": "Payment required",\n  "accepts": [{\n    "scheme": "exact",\n    "network": "eip155:8453",\n    "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",\n    "payTo": "0xYOUR_WALLET",\n    "amount": "10000"\n  }]\n}`,
    });
  }
  if (r.is_402 && r.x402_envelope !== 'missing' && !r.envelope_valid) {
    guides.push({
      title: 'Repair the envelope fields that fail validation',
      body: `Specific validation failures found: ${r.envelope_errors.join('; ')}. Strict clients reject the entire offer over any one of these. Every accepts[] entry needs scheme, network (e.g. eip155:8453 for Base), asset (the token contract address), payTo (your receive wallet), and amount (atomic units as a string).`,
    });
  }
  if (r.is_402 && r.envelope_valid && r.x402_envelope === 'body') {
    guides.push({
      title: 'Move (or mirror) the envelope into the payment-required header',
      body: 'Your envelope lives only in the response body. Several client libraries check only the payment-required header and will miss it. Safest posture: send the base64 envelope in the header AND keep a human-readable JSON body — costs nothing, catches both kinds of client.',
    });
  }
  if (r.is_402 && r.envelope_valid && !r.mpp_dual_stack) {
    guides.push({
      title: 'Add MPP dual-stack and reach the second agent population',
      body: 'Your x402 side is healthy. Adding a WWW-Authenticate: Payment challenge alongside it makes the same endpoint payable by agents speaking Stripe’s Machine Payments Protocol — same Base USDC settlement, one extra response header plus settle handling. In our August 2026 census, 15% of all Bazaar sellers already answer both; they are competing for two buyer pools with one endpoint.',
    });
  }
  if (r.method_used === 'POST') {
    guides.push({
      title: 'Answer the 402 challenge on GET too, not just POST',
      body: 'Your paywall answers POST but returns a bare 405 to GET. Discovering agents often probe with GET first — a 405 with no challenge reads as "not a paid resource." Return the same 402 + envelope on GET (advertising the price) even if the real work only accepts POST.',
    });
  }
  if (guides.length === 0) {
    guides.push({
      title: 'Nothing to fix — keep it that way',
      body: 'This endpoint passes every check we run: reachable, correct 402 challenge, valid parseable envelope, and MPP dual-stack. The failure mode that still gets endpoints like this one is silent regression after a deploy — a middleware reorder or env change that never gets re-tested from outside. Re-scan after every deploy, or let ForgeMesh Watch do it daily.',
    });
  }
  return guides;
}
