// Free quantum-readiness check for humans (forgemesh.io/quantum). Same probes
// the paid Utility Grid route runs for agents (x402.forgemesh.io/quantum-readiness,
// $0.05), run server-side here with a per-IP rate limit and a short cache.
// Read-only: four TLS handshakes, one HEAD, one CAA lookup. Nothing stored.
import tls from 'node:tls';
import dns from 'node:dns/promises';

const T = 8000;
type HS = { ok: boolean; ms?: number; protocol?: string | null; cipher?: string | null; group?: string | null; alpn?: string | null; authorized?: boolean; error?: string; cert?: { subject: string | null; issuer: string | null; key: string | null; valid_to: string | null } };

function handshake(host: string, port: number, opts: tls.ConnectionOptions): Promise<HS> {
  return new Promise((resolve) => {
    const t0 = Date.now(); let done = false; const fin = (v: HS) => { if (!done) { done = true; resolve(v); } };
    let s: tls.TLSSocket;
    try {
      s = tls.connect({ host, port, servername: host, rejectUnauthorized: false, timeout: T, ...opts }, () => {
        const c = s.getPeerCertificate(false) as Record<string, unknown>;
        const eph = s.getEphemeralKeyInfo() as { name?: string };
        fin({ ok: true, ms: Date.now() - t0, protocol: s.getProtocol(), cipher: s.getCipher()?.name ?? null, group: eph?.name ?? null, alpn: s.alpnProtocol || null, authorized: s.authorized,
          cert: { subject: ((c.subject as Record<string, string>) || {}).CN ?? null, issuer: ((c.issuer as Record<string, string>) || {}).O ?? null, key: (c.asn1Curve as string) || (c.bits ? `rsa-${c.bits}` : null), valid_to: (c.valid_to as string) ?? null } });
        s.end();
      });
    } catch (e) { return fin({ ok: false, error: (e as Error).message }); }
    s.on('error', (e: NodeJS.ErrnoException) => fin({ ok: false, ms: Date.now() - t0, error: e.code || e.message }));
    s.on('timeout', () => { s.destroy(); fin({ ok: false, error: 'timeout' }); });
  });
}

function isPrivate(host: string) { return /^(localhost|.*\.(local|internal|test|localhost)|\d+\.\d+\.\d+\.\d+|\[?[0-9a-f:]+\]?)$/i.test(host); }

export type Check = { check: string; points: number; max: number; ok: boolean; note?: string };
export type QuantumReport = {
  domain: string; checked_at: string; elapsed_ms: number; score: number; max_score_today: number;
  verdict: 'ready' | 'ready-with-gaps' | 'partial' | 'exposed'; hndl_exposure: 'protected' | 'exposed'; hndl_meaning: string;
  checks: Check[]; recommendations: string[];
  findings: { hybrid_pq: boolean; pure_pq: boolean; classical_group: string | null; tls12_accepted: boolean; protocol: string | null; cipher: string | null; hsts: string | null; hsts_max_age: number | null; caa: boolean; cert: HS['cert'] | null; cert_days_left: number | null; chain_trusted: boolean; x402_seller: boolean };
  cached?: boolean;
};

export class QuantumInputError extends Error {}

export function cleanDomain(raw: string): string {
  const host = String(raw || '').trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
  if (!host || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host) || isPrivate(host)) throw new QuantumInputError('Enter a public hostname, like example.com');
  return host;
}

const cache = new Map<string, { at: number; report: QuantumReport }>();
export function cached(domain: string): QuantumReport | null { const c = cache.get(domain); return c && Date.now() - c.at < 10 * 60 * 1000 ? c.report : null; }

export async function runQuantumCheck(domain: string): Promise<QuantumReport> {
  const t0 = Date.now(); const port = 443;
  const [hybrid, pure, classical, tls12, head, caa, x402] = await Promise.all([
    handshake(domain, port, { ecdhCurve: 'X25519MLKEM768', minVersion: 'TLSv1.3', maxVersion: 'TLSv1.3' }),
    handshake(domain, port, { ecdhCurve: 'MLKEM768', minVersion: 'TLSv1.3', maxVersion: 'TLSv1.3' }),
    handshake(domain, port, { ecdhCurve: 'X25519:prime256v1:secp384r1', ALPNProtocols: ['h2', 'http/1.1'] }),
    handshake(domain, port, { minVersion: 'TLSv1.2', maxVersion: 'TLSv1.2' }),
    fetch(`https://${domain}/`, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(T) }).then((r) => ({ hsts: r.headers.get('strict-transport-security') })).catch(() => ({ hsts: null })),
    dns.resolveCaa(domain).then((r) => Array.isArray(r) && r.length > 0).catch(() => false),
    fetch(`https://${domain}/.well-known/x402.json`, { method: 'GET', signal: AbortSignal.timeout(T) }).then((r) => r.status === 200).catch(() => false),
  ]);
  if (!classical.ok && !hybrid.ok) throw new QuantumInputError(`No TLS handshake with ${domain} (${classical.error || 'unreachable'})`);
  const cert = classical.cert || hybrid.cert || null;
  const validTo = cert?.valid_to ? Date.parse(cert.valid_to) : NaN;
  const daysLeft = Number.isFinite(validTo) ? Math.floor((validTo - Date.now()) / 86400000) : null;
  const hstsAge = head.hsts ? Number((/max-age\s*=\s*(\d+)/i.exec(head.hsts) || [])[1] || 0) : null;

  const checks: Check[] = []; const recs: string[] = []; let score = 0;
  const add = (points: number, max: number, check: string, ok: boolean, note?: string) => { checks.push({ check, points, max, ok, note }); score += points; };
  add(hybrid.ok ? 50 : 0, 50, 'Post-quantum key exchange (X25519MLKEM768) negotiated', hybrid.ok);
  if (!hybrid.ok) recs.push('Enable the hybrid group X25519MLKEM768 for TLS 1.3. Cloudflare, Fastly and Vercel edges do it by default; nginx needs OpenSSL 3.5+ and `ssl_ecdh_curve X25519MLKEM768:X25519:prime256v1;`; Caddy (Go 1.24+), Node 24+ and HAProxy 3.1+ enable it by default or via the groups list.');
  add(pure.ok ? 5 : 0, 5, 'Pure ML-KEM-768 group also accepted', pure.ok);
  add(tls12.ok ? 0 : 10, 10, 'TLS 1.2 refused (no non-PQ downgrade path)', !tls12.ok);
  if (tls12.ok) recs.push('TLS 1.2 is still accepted. Every 1.2 session is classical-only and recordable for later decryption. Set the minimum to TLS 1.3 once your clients allow it.');
  const hstsPts = hstsAge == null ? 0 : hstsAge >= 15552000 ? 10 : 5;
  add(hstsPts, 10, 'HSTS with max-age of 180 days or more', hstsPts === 10);
  if (hstsPts < 10) recs.push(hstsAge == null ? 'Add Strict-Transport-Security so clients never fall back to plaintext before the handshake.' : 'Raise HSTS max-age to at least 15552000 (180 days) and add includeSubDomains.');
  const certOk = classical.ok && daysLeft != null && daysLeft > 14;
  add(certOk ? 10 : 0, 10, 'Certificate valid with more than 14 days left', certOk);
  if (!certOk) recs.push('Certificate missing, expired or expiring within 14 days. Automate renewal so the authentication leg never lapses.');
  add(caa ? 5 : 0, 5, 'CAA record restricts which CAs may issue', caa);
  if (!caa) recs.push('Publish a CAA record naming your certificate authority. It limits mis-issuance, which matters more as CAs move to post-quantum certificates.');
  checks.push({ check: 'Post-quantum certificate signature (ML-DSA)', points: 0, max: 10, ok: false, note: 'Not yet deployable in the public web PKI. Reserved.' });
  const verdict = hybrid.ok && score >= 80 ? 'ready' : hybrid.ok ? 'ready-with-gaps' : score >= 30 ? 'partial' : 'exposed';
  const report: QuantumReport = {
    domain, checked_at: new Date().toISOString(), elapsed_ms: Date.now() - t0, score, max_score_today: 90, verdict,
    hndl_exposure: hybrid.ok ? 'protected' : 'exposed',
    hndl_meaning: hybrid.ok ? 'Sessions recorded today cannot be opened later by a quantum computer: the key exchange already includes ML-KEM.' : 'Sessions recorded today could be opened later by a quantum computer: the key exchange is classical only (harvest now, decrypt later).',
    checks, recommendations: recs,
    findings: { hybrid_pq: hybrid.ok, pure_pq: pure.ok, classical_group: classical.group ?? null, tls12_accepted: tls12.ok, protocol: classical.protocol ?? null, cipher: classical.cipher ?? null, hsts: head.hsts, hsts_max_age: hstsAge, caa, cert, cert_days_left: daysLeft, chain_trusted: classical.authorized === true, x402_seller: x402 },
  };
  cache.set(domain, { at: Date.now(), report }); if (cache.size > 2000) cache.clear();
  return report;
}
