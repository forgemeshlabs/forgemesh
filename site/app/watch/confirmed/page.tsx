import type { Metadata } from 'next';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';
import { getWatchSession } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Watch Activated | ForgeMesh Labs',
  robots: { index: false, follow: false },
};

const STORE = path.join(process.cwd(), 'data', 'watch-subscribers.json');

async function recordSubscriber(entry: { url: string; subscription_id: string; customer_email: string | null }) {
  await fs.mkdir(path.dirname(STORE), { recursive: true });
  let list: Array<{ subscription_id: string }> = [];
  try {
    list = JSON.parse(await fs.readFile(STORE, 'utf8'));
  } catch {
    /* first subscriber */
  }
  if (!list.some((s) => s.subscription_id === entry.subscription_id)) {
    list.push({ ...entry, created_at: new Date().toISOString() } as never);
    await fs.writeFile(STORE, JSON.stringify(list, null, 2), { mode: 0o600 });
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">{children}</div>
        </section>
        <Footer />
      </main>
    </>
  );
}

export default async function WatchConfirmedPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold text-slate-50">No session</h1>
        <p className="mt-4 text-slate-400">
          This page confirms a ForgeMesh Watch subscription.{' '}
          <a href="/scan" className="text-blue-400 hover:text-blue-300">Set one up from the scanner →</a>
        </p>
      </Shell>
    );
  }

  let session: Awaited<ReturnType<typeof getWatchSession>> | null = null;
  try {
    session = await getWatchSession(sessionId);
  } catch {
    /* handled below */
  }

  if (!session?.paid || !session.watchUrl || !session.subscriptionId) {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold text-slate-50">Payment not confirmed</h1>
        <p className="mt-4 leading-8 text-slate-400">
          We couldn&apos;t verify this subscription yet. If you just paid, wait a few seconds and refresh. If it
          persists, reply to your Stripe receipt email and we&apos;ll make it right.
        </p>
      </Shell>
    );
  }

  await recordSubscriber({
    url: session.watchUrl,
    subscription_id: session.subscriptionId,
    customer_email: session.customerEmail,
  });

  return (
    <Shell>
      <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
        <ForgeMeshMark size={22} className="shrink-0" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/80">Watch active</span>
      </div>

      <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">
        We&apos;re watching it now.
      </h1>
      <p className="mt-6 break-all font-mono text-sm text-slate-300">{session.watchUrl}</p>
      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">
        Your endpoint joins the daily sweep — the same probe from our census of all 1,225 Bazaar sellers. Every day we
        check that it answers a real 402, that the payment envelope parses, and whether it speaks MPP dual-stack. The
        moment the grade changes — paywall breaks, envelope stops parsing, listing dies — you get an email
        {session.customerEmail ? <> at <span className="text-slate-200">{session.customerEmail}</span></> : null} with
        exactly what broke and how to fix it.
      </p>
      <p className="mt-4 text-sm leading-7 text-slate-500">
        Nothing happens on quiet days — no noise, just the alert that saves you a week of silent zero-revenue. Manage
        or cancel any time via your Stripe receipt email.
      </p>
      <a
        href="/scan"
        className="mt-8 inline-flex items-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20"
      >
        Watch another endpoint <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </Shell>
  );
}
