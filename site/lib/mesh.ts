export type Brand = 'ForgeMesh' | 'CoinOpAI';

export interface ServiceDef {
  id: string;
  name: string;
  brand: Brand;
  domain: string;
  tagline: string;
  npm?: string;
  page?: string;
}

/** The fleet, in board order: first four = top row, last four = bottom row. */
export const FLEET: ServiceDef[] = [
  {
    id: 'notary',
    name: 'Notary',
    brand: 'ForgeMesh',
    domain: 'notary.forgemesh.io',
    tagline: 'Signed, chain-anchored receipts for AI outputs. Free to verify, forever.',
    npm: '@forgemeshlabs/x402-notary-mcp',
  },
  {
    id: 'anomaly',
    name: 'Anomaly Tracker',
    brand: 'ForgeMesh',
    domain: 'anomaly.forgemesh.io',
    tagline: 'Cross-domain anomaly detection: blockchain, aviation, creator economies.',
    npm: '@forgemeshlabs/anomaly-mcp',
  },
  {
    id: 'disruption',
    name: 'Disruption Intel',
    brand: 'ForgeMesh',
    domain: 'disruption.forgemesh.io',
    tagline: 'Source-linked WARN layoff intelligence and business ripple analysis.',
    npm: '@forgemeshlabs/disruption-intelligence-mcp',
  },
  {
    id: 'travel-agent',
    name: 'Travel Agent',
    brand: 'ForgeMesh',
    domain: 'travel-agent.forgemesh.io',
    tagline: 'Route intelligence and travel pulse for autonomous booking agents.',
    npm: '@forgemeshlabs/travel-agent-mcp',
  },
  {
    id: 'voice',
    name: 'ClawVoice TTS',
    brand: 'ForgeMesh',
    domain: 'voice.forgemesh.io',
    tagline: 'Text to speech for agents — 20 voices, 31 languages, OpenAI-compatible.',
    page: '/clawvoice',
  },
  {
    id: 'fares',
    name: 'Fare Intelligence',
    brand: 'ForgeMesh',
    domain: 'travel.forgemesh.io',
    tagline: 'Live flight-fare intelligence feeds.',
  },
  {
    id: 'coinopai',
    name: 'CoinOpAI x402',
    brand: 'CoinOpAI',
    domain: 'x402.coinopai.com',
    tagline: 'Kronos market signals and 819 agent automation prompts.',
    npm: 'coinopai-mcp',
  },
  {
    id: 'imagegen',
    name: 'ImageGen',
    brand: 'CoinOpAI',
    domain: 'imagegen.coinopai.com',
    tagline: 'Flux image generation in four quality tiers.',
    npm: 'forgemesh-imagegen',
  },
];

export interface ServiceLive {
  id: string;
  status: 'up' | 'down';
  latencyMs: number | null;
  version: string | null;
  endpoints: number | null;
  floor: number | null;
}

export interface MeshData {
  services: ServiceLive[];
  totals: { up: number; total: number; endpoints: number; floor: number | null };
  checkedAt: string;
}

const HEALTH_TTL_MS = 25_000;
const MANIFEST_TTL_MS = 3_600_000;

let healthCache: { at: number; data: MeshData } | null = null;
let manifestCache: {
  at: number;
  data: Map<string, { endpoints: number | null; floor: number | null }>;
} | null = null;

async function fetchJson(url: string, timeoutMs = 5000): Promise<unknown> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    cache: 'no-store',
    headers: { accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

/** Accepts "$0.001", "0.25", 0.25, or atomic USDC units like "1000" / 250000. */
function parsePrice(v: unknown): number | null {
  let n: number;
  let dollarString = false;
  if (typeof v === 'string') {
    const s = v.trim();
    dollarString = s.startsWith('$');
    n = parseFloat(dollarString ? s.slice(1) : s);
  } else if (typeof v === 'number') {
    n = v;
  } else {
    return null;
  }
  if (!Number.isFinite(n) || n <= 0) return null;
  if (dollarString) return n;
  return n >= 50 ? n / 1e6 : n;
}

function manifestInfo(j: unknown): { endpoints: number | null; floor: number | null } {
  const o = j as Record<string, unknown> | null;
  const eps = (o?.endpoints ?? o?.accepts ?? o?.resources) as unknown;
  if (!Array.isArray(eps)) return { endpoints: null, floor: null };
  let floor: number | null = null;
  for (const e of eps) {
    const raw =
      e?.price ??
      e?.maxAmountRequired ??
      e?.accepts?.[0]?.price ??
      e?.accepts?.[0]?.maxAmountRequired;
    const p = parsePrice(raw);
    if (p !== null && (floor === null || p < floor)) floor = p;
  }
  return { endpoints: eps.length, floor };
}

async function getManifests() {
  const now = Date.now();
  if (manifestCache && now - manifestCache.at < MANIFEST_TTL_MS) return manifestCache.data;
  const entries = await Promise.all(
    FLEET.map(async (s) => {
      try {
        const j = await fetchJson(`https://${s.domain}/.well-known/x402.json`, 6000);
        return [s.id, manifestInfo(j)] as const;
      } catch {
        return [s.id, { endpoints: null, floor: null }] as const;
      }
    }),
  );
  const data = new Map(entries);
  manifestCache = { at: now, data };
  return data;
}

export async function getMeshData(): Promise<MeshData> {
  const now = Date.now();
  if (healthCache && now - healthCache.at < HEALTH_TTL_MS) return healthCache.data;

  const manifests = await getManifests();
  const services: ServiceLive[] = await Promise.all(
    FLEET.map(async (s) => {
      const m = manifests.get(s.id) ?? { endpoints: null, floor: null };
      const t0 = Date.now();
      try {
        const j = (await fetchJson(`https://${s.domain}/health`)) as Record<string, unknown>;
        const ok = j?.status === 'ok' || j?.status === 'healthy';
        return {
          id: s.id,
          status: ok ? ('up' as const) : ('down' as const),
          latencyMs: Date.now() - t0,
          version: typeof j?.version === 'string' ? j.version : null,
          ...m,
        };
      } catch {
        return { id: s.id, status: 'down' as const, latencyMs: null, version: null, ...m };
      }
    }),
  );

  const floors = services.map((s) => s.floor).filter((f): f is number => f !== null);
  const data: MeshData = {
    services,
    totals: {
      up: services.filter((s) => s.status === 'up').length,
      total: services.length,
      endpoints: services.reduce((n, s) => n + (s.endpoints ?? 0), 0),
      floor: floors.length ? Math.min(...floors) : null,
    },
    checkedAt: new Date().toISOString(),
  };
  healthCache = { at: now, data };
  return data;
}
