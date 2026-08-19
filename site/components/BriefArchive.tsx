'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

type Issue = {
  n: number;
  subject: string;
  sentAt: string;
  archiveUrl: string | null;
};

export function BriefArchive() {
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/brief-archive.json')
      .then((r) => {
        if (!r.ok) throw new Error(`status ${r.status}`);
        return r.json();
      })
      .then((d: Issue[]) => {
        if (!cancelled) setIssues(d);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed || !issues || issues.length === 0) return null;

  const sorted = [...issues].sort((a, b) => b.n - a.n);

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-50">Issue archive</h2>
      <div className="mt-6 space-y-4">
        {sorted.map((issue) => (
          <div
            key={issue.n}
            className="rounded border border-white/[0.06] bg-white/[0.02] p-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
              Issue #{issue.n} &middot; {issue.sentAt}
            </p>
            <p className="mt-2 text-sm font-medium text-slate-200">{issue.subject}</p>
            {issue.archiveUrl && (
              <a
                href={issue.archiveUrl}
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300"
              >
                Read the archive <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
