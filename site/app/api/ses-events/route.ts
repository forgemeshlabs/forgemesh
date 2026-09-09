import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

// SES event receiver: SES configuration set → SNS topic → HTTPS subscription
// to https://forgemesh.io/api/ses-events?token=<SES_EVENTS_TOKEN>.
// Two gates: the shared token in the URL, and the SNS message signature
// (certificate must come from sns.<region>.amazonaws.com). Confirms the
// subscription automatically, then appends every SES event (Send, Delivery,
// Bounce, Complaint, Reject, ...) to the shared ses-log ledger so `sesmail`
// can show delivery state per message.
const EVENTS_FILE = '/home/ubuntu/dev/ses-log/data/ses-events.jsonl';
const CERT_HOST = /^sns\.[a-z0-9-]+\.amazonaws\.com$/;
const certCache = new Map<string, string>();

type SnsMessage = {
  Type: string; MessageId: string; TopicArn: string; Message: string; Timestamp: string;
  SignatureVersion: string; Signature: string; SigningCertURL: string;
  Subject?: string; SubscribeURL?: string; Token?: string;
};

async function fetchCert(url: string): Promise<string> {
  const u = new URL(url);
  if (u.protocol !== 'https:' || !CERT_HOST.test(u.hostname) || !u.pathname.endsWith('.pem')) throw new Error('bad cert url');
  const cached = certCache.get(url);
  if (cached) return cached;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000), cache: 'no-store' });
  if (!res.ok) throw new Error('cert fetch failed');
  const pem = await res.text();
  certCache.set(url, pem);
  return pem;
}

// String-to-sign per the SNS spec: sorted "Key\nValue\n" pairs of the fields present.
function stringToSign(m: SnsMessage): string {
  const keys = m.Type === 'Notification'
    ? ['Message', 'MessageId', 'Subject', 'Timestamp', 'TopicArn', 'Type']
    : ['Message', 'MessageId', 'SubscribeURL', 'Timestamp', 'Token', 'TopicArn', 'Type'];
  return keys.filter((k) => (m as Record<string, unknown>)[k] !== undefined)
    .map((k) => `${k}\n${(m as Record<string, string>)[k]}\n`).join('');
}

async function verify(m: SnsMessage): Promise<boolean> {
  try {
    const pem = await fetchCert(m.SigningCertURL);
    const algo = m.SignatureVersion === '2' ? 'RSA-SHA256' : 'RSA-SHA1';
    return crypto.createVerify(algo).update(stringToSign(m), 'utf8').verify(pem, m.Signature, 'base64');
  } catch { return false; }
}

function record(row: Record<string, unknown>) {
  try {
    fs.mkdirSync(path.dirname(EVENTS_FILE), { recursive: true });
    fs.appendFileSync(EVENTS_FILE, JSON.stringify({ ts: new Date().toISOString(), ...row }) + '\n', { mode: 0o600 });
  } catch (e) { console.error('[ses-events] could not record', (e as Error).message); }
}

export async function POST(req: NextRequest) {
  const expected = process.env.SES_EVENTS_TOKEN;
  if (!expected || req.nextUrl.searchParams.get('token') !== expected) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const raw = await req.text();
  if (raw.length > 256 * 1024) return NextResponse.json({ error: 'too large' }, { status: 413 });
  let m: SnsMessage;
  try { m = JSON.parse(raw); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  if (!m?.Type || !m.Signature || !m.SigningCertURL) return NextResponse.json({ error: 'not sns' }, { status: 400 });
  if (!(await verify(m))) return NextResponse.json({ error: 'bad signature' }, { status: 403 });

  if (m.Type === 'SubscriptionConfirmation' && m.SubscribeURL) {
    const u = new URL(m.SubscribeURL);
    if (u.protocol !== 'https:' || !CERT_HOST.test(u.hostname)) return NextResponse.json({ error: 'bad subscribe url' }, { status: 400 });
    const res = await fetch(m.SubscribeURL, { signal: AbortSignal.timeout(8000), cache: 'no-store' });
    record({ kind: 'sns-subscription', topic: m.TopicArn, confirmed: res.ok });
    return NextResponse.json({ ok: true, confirmed: res.ok });
  }
  if (m.Type === 'UnsubscribeConfirmation') { record({ kind: 'sns-unsubscribe', topic: m.TopicArn }); return NextResponse.json({ ok: true }); }
  if (m.Type !== 'Notification') return NextResponse.json({ ok: true, ignored: m.Type });

  let ev: Record<string, unknown> = {};
  try { ev = JSON.parse(m.Message); } catch { record({ kind: 'ses-event', eventType: 'unparsed', raw: m.Message.slice(0, 2000) }); return NextResponse.json({ ok: true }); }
  const mail = (ev.mail || {}) as Record<string, unknown>;
  const type = String(ev.eventType || ev.notificationType || 'unknown');
  const detail = (ev[type.toLowerCase()] || {}) as Record<string, unknown>;
  record({
    kind: 'ses-event',
    eventType: type,
    sesId: mail.messageId,
    to: mail.destination,
    subject: ((mail.commonHeaders || {}) as Record<string, unknown>).subject,
    sentAt: mail.timestamp,
    bounceType: detail.bounceType, bounceSubType: detail.bounceSubType,
    complaintType: detail.complaintFeedbackType,
    recipients: (detail.bouncedRecipients || detail.complainedRecipients || detail.recipients) as unknown,
    smtpResponse: detail.smtpResponse,
    reason: detail.reason,
  });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, receiver: 'ses-events', method: 'POST' });
}
