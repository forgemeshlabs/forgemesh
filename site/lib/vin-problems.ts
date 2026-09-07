// Shared types + disk readers for the VIN Problems programmatic-SEO pages
// (forgemesh.io/vin/<slug>). Data is written by scripts/vin-problems.js
// (NHTSA complaints + recalls, cron'd weekly) into public/vin-problems/ —
// this file just reads it back at request time, same pattern as
// lib used by app/trades/page.tsx for public/congress-trades.json.
import fs from 'fs';
import path from 'path';

const DIR = path.join(process.cwd(), 'public', 'vin-problems');

export type FailureComponent = {
  component: string;
  complaints: number;
  share_pct: number;
  excerpts: string[];
};

export type VinProblemsData = {
  slug: string;
  year: number;
  make: string;
  model: string;
  matched_as: { complaints: string[] | null; recalls: string[] | null };
  failures: {
    total_complaints: number;
    top_failure_components: FailureComponent[];
    severity: { crashes: number; fires: number; injuries: number; deaths: number };
    trend_by_incident_year: { year: number; count: number }[];
  };
  recalls: {
    count: number;
    recalls: {
      campaign_number: string;
      component: string;
      summary: string;
      report_date: string;
      park_it: boolean;
      park_outside: boolean;
    }[];
  };
  generated: string;
  source: string;
};

export type VinProblemsIndexEntry = {
  slug: string;
  year: number;
  make: string;
  model: string;
  complaint_count: number;
  recall_count: number;
  top_component: string | null;
};

export function loadVinProblemsIndex(): VinProblemsIndexEntry[] {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(DIR, 'index.json'), 'utf8'));
    return raw.entries || [];
  } catch {
    return [];
  }
}

export function loadVinProblemsSlug(slug: string): VinProblemsData | null {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  try {
    return JSON.parse(fs.readFileSync(path.join(DIR, `${slug}.json`), 'utf8'));
  } catch {
    return null;
  }
}
