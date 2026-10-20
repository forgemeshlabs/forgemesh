// Free quantum-readiness check for humans (forgemesh.io/quantum). Same probes
// the paid Utility Grid route runs for agents (x402.forgemesh.io/quantum-readiness,
// $0.05), run server-side here with a per-IP rate limit and a short cache.
// Read-only: four TLS handshakes, one HEAD, one CAA lookup. Nothing stored.
import tls from 'node:tls';
import dns from 'node:dns/promises';
import net from 'node:net';
import { isPrivateAddr, requestPinned, parseHsts, isManifest } from './quantum-network.cjs';

const T = 8000;
export class QuantumInputError extends Error {}
type HS = { ok: boolean; ms?: number; protocol?: string | null; cipher?: string | null; group?: string | null; alpn?: string | null; authorized?: boolean; error?: string; cert?: { subject: string | null; issuer: string | null; key: string | null; valid_to: string | null } };

const coarse = (e: NodeJS.ErrnoException) => (/timeout/i.test(e.code || e.message || '') ? 'timeout' : /HANDSHAKE|ALERT|SSL|TLS|PROTOCOL/i.test(e.code || e.message || '') ? 'handshake_refused' : 'unreachable');

function handshake(host: string, addr: string, port: number, opts: tls.ConnectionOptions): Promise<HS> {
  return new Promise((resolve) => {
    const t0 = Date.now(); let done = false; const fin = (v: HS) => { if (!done) { done = true; clearTimeout(deadline); s?.destroy(); resolve(v); } };
    let s: tls.TLSSocket;
    const deadline = setTimeout(() => fin({ ok: false, error: 'timeout' }), T);
    try {
      s = tls.connect({ host: addr, port, servername: host, rejectUnauthorized: false, timeout: T, ...opts }, () => {
        const c = s.getPeerCertificate(false) as unknown as Record<string, unknown>;
        const eph = s.getEphemeralKeyInfo() as { name?: string };
        fin({ ok: true, ms: Date.now() - t0, protocol: s.getProtocol(), cipher: s.getCipher()?.name ?? null, group: eph?.name ?? null, alpn: s.alpnProtocol || null, authorized: s.authorized,
          cert: { subject: ((c.subject as Record<string, string>) || {}).CN ?? null, issuer: ((c.issuer as Record<string, string>) || {}).O ?? null, key: (c.asn1Curve as string) || (c.bits ? `rsa-${c.bits}` : null), valid_to: (c.valid_to as string) ?? null } });
        s.destroy();
      });
    } catch (e) { return fin({ ok: false, error: coarse(e as NodeJS.ErrnoException) }); }
    s.on('error', (e: NodeJS.ErrnoException) => fin({ ok: false, ms: Date.now() - t0, error: coarse(e) }));
    s.on('timeout', () => { s.destroy(); fin({ ok: false, error: 'timeout' }); });
  });
}

function isPrivate(host: string) { return net.isIP(host) !== 0 || /^(localhost|.*\.(local|internal|test|localhost))$/i.test(host); }
async function resolvePublic(host: string): Promise<string> {
  const all = await dns.lookup(host, { all: true, verbatim: true }).catch(() => [] as { address: string }[]);
  if (!all.length) throw new QuantumInputError('That hostname does not resolve');
  if (all.some((a) => isPrivateAddr(a.address))) throw new QuantumInputError('That hostname resolves to a private address');
  return all[0].address;
}

export type Check = { check: string; points: number; max: number; ok: boolean; note?: string };
export type QuantumReport = {
  domain: string; checked_at: string; elapsed_ms: number; score: number; max_score_today: number;
  verdict: 'ready' | 'ready-with-gaps' | 'partial' | 'exposed'; hndl_exposure: 'protected' | 'exposed'; hndl_meaning: string;
  checks: Check[]; recommendations: string[];
  findings: { hybrid_pq: boolean; pure_pq: boolean; classical_group: string | null; tls12_accepted: boolean; tls12_result: string; protocol: string | null; cipher: string | null; hsts: string | null; hsts_max_age: number | null; caa: boolean; cert: HS['cert'] | null; cert_days_left: number | null; chain_trusted: boolean; x402_seller: boolean };
  cached?: boolean;
};


export function cleanDomain(raw: string): string {
  const host = String(raw || '').trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
  if (!host || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host) || isPrivate(host)) throw new QuantumInputError('Enter a public hostname, like example.com');
  return host;
}

const cache = new Map<string, { at: number; report: QuantumReport }>();
export function cached(domain: string): QuantumReport | null { const c = cache.get(domain); return c && Date.now() - c.at < 10 * 60 * 1000 ? c.report : null; }

export async function runQuantumCheck(domain: string): Promise<QuantumReport> {
  const t0 = Date.now(); const port = 443;
  const addr = await resolvePublic(domain);
  const [hybrid, pure, classical, tls12, head, caa, x402] = await Promise.all([
    handshake(domain, addr, port, { ecdhCurve: 'X25519MLKEM768', minVersion: 'TLSv1.3', maxVersion: 'TLSv1.3' }),
    handshake(domain, addr, port, { ecdhCurve: 'MLKEM768', minVersion: 'TLSv1.3', maxVersion: 'TLSv1.3' }),
    handshake(domain, addr, port, { ecdhCurve: 'X25519:prime256v1:secp384r1', ALPNProtocols: ['h2', 'http/1.1'] }),
    handshake(domain, addr, port, { minVersion: 'TLSv1.2', maxVersion: 'TLSv1.2' }),
    requestPinned(domain, addr, '/', 'HEAD').then((r) => ({ hsts: typeof r.headers['strict-transport-security'] === 'string' ? r.headers['strict-transport-security'] : null })).catch(() => ({ hsts: null })),
    dns.resolveCaa(domain).then((r) => Array.isArray(r) && r.length > 0).catch(() => false),
    requestPinned(domain, addr, '/.well-known/x402.json').then((r) => r.status === 200 && isManifest(r.body)).catch(() => false),
  ]);
  if (!classical.ok && !hybrid.ok) throw new QuantumInputError(`${domain} did not complete a TLS handshake`);
  const rawCert = classical.cert || hybrid.cert || null;
  const cert = rawCert && classical.authorized !== true ? { ...rawCert, subject: null, issuer: null } : rawCert;
  const validTo = cert?.valid_to ? Date.parse(cert.valid_to) : NaN;
  const daysLeft = Number.isFinite(validTo) ? Math.floor((validTo - Date.now()) / 86400000) : null;
  const hstsAge = parseHsts(head.hsts)?.max_age ?? null;

  const checks: Check[] = []; const recs: string[] = []; let score = 0;
  const add = (points: number, max: number, check: string, ok: boolean, note?: string) => { checks.push({ check, points, max, ok, note }); score += points; };
  add(hybrid.ok ? 50 : 0, 50, 'Post-quantum key exchange (X25519MLKEM768) negotiated', hybrid.ok);
  if (!hybrid.ok) recs.push('Enable the hybrid group X25519MLKEM768 for TLS 1.3. Check your CDN or TLS library documentation. For nginx built with OpenSSL 3.5+, configure `ssl_ecdh_curve X25519MLKEM768:X25519:prime256v1;` and verify after reloading.');
  add(pure.ok ? 5 : 0, 5, 'Pure ML-KEM-768 group also accepted', pure.ok);
  const refused = !tls12.ok && tls12.error === 'handshake_refused';
  add(refused ? 10 : 0, 10, 'TLS 1.2 handshake refused (timeouts are inconclusive)', refused);
  if (tls12.ok) recs.push('TLS 1.2 is still accepted. Every 1.2 session is classical-only and recordable for later decryption. Set the minimum to TLS 1.3 once your clients allow it; also enable hybrid key exchange, since TLS 1.3 alone is not post-quantum.');
  const hstsPts = hstsAge == null ? 0 : hstsAge >= 15552000 ? 10 : 5;
  add(hstsPts, 10, 'HSTS with max-age of 180 days or more', hstsPts === 10);
  if (hstsPts < 10) recs.push(hstsAge == null ? 'Add Strict-Transport-Security so clients never fall back to plaintext before the handshake.' : 'Raise HSTS max-age to at least 15552000 (180 days) and add includeSubDomains.');
  const certOk = classical.ok && classical.authorized === true && daysLeft != null && daysLeft > 14;
  add(certOk ? 10 : 0, 10, 'Certificate chain trusted with more than 14 days left', certOk);
  if (!certOk) recs.push('Certificate chain not trusted by a public root, expired, or expiring within 14 days. Automate renewal so the authentication leg never lapses.');
  add(caa ? 5 : 0, 5, 'CAA record restricts which CAs may issue', caa);
  if (!caa) recs.push('Publish a CAA record naming your certificate authority. It limits mis-issuance, which matters more as CAs move to post-quantum certificates.');
  checks.push({ check: 'Post-quantum certificate signature (ML-DSA)', points: 0, max: 10, ok: false, note: 'Not assessed by this probe. Reserved.' });
  const verdict = hybrid.ok && score >= 80 ? 'ready' : hybrid.ok ? 'ready-with-gaps' : score >= 30 ? 'partial' : 'exposed';
  const report: QuantumReport = {
    domain, checked_at: new Date().toISOString(), elapsed_ms: Date.now() - t0, score, max_score_today: 90, verdict,
    hndl_exposure: hybrid.ok ? 'protected' : 'exposed',
    hndl_meaning: hybrid.ok ? 'The hybrid probe negotiated ML-KEM. Other clients can still negotiate classical key exchange; this does not establish protection for every session or the origin connection.' : 'The X25519MLKEM768 probe did not succeed. Classical sessions remain at harvest-now-decrypt-later risk; other PQ groups are not ruled out.',
    checks, recommendations: recs,
    findings: { hybrid_pq: hybrid.ok, pure_pq: pure.ok, classical_group: classical.group ?? null, tls12_accepted: tls12.ok, tls12_result: tls12.ok ? "accepted" : tls12.error || "unknown", protocol: classical.protocol ?? null, cipher: classical.cipher ?? null, hsts: head.hsts, hsts_max_age: hstsAge, caa, cert, cert_days_left: daysLeft, chain_trusted: classical.authorized === true, x402_seller: x402 },
  };
  cache.set(domain, { at: Date.now(), report }); if (cache.size > 2000) cache.clear();
  return report;
}
