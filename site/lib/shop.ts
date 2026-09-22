// Agent Shop catalog reader. Same pattern as data/go-links.json: read the
// JSON file per request, so a new product or a status flip (coming_soon →
// live) goes live without a rebuild.
import fs from 'fs';
import path from 'path';

export type ShopStatus = 'live' | 'coming_soon';

export type ShopProduct = {
  id: string;
  name: string;
  image: string | null;
  price: string | null;
  why_hot: string;
  category: string;
  affiliate_partner: string | null;
  go_link: string | null;
  agent_manifest: string | null;
  trending_score: number;
  added: string;
  status: ShopStatus;
  tags: string[];
};

const CATALOG_FILE = path.join(process.cwd(), 'data', 'shop-catalog.json');

export function getShopCatalog(): ShopProduct[] {
  try {
    return JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8')) as ShopProduct[];
  } catch {
    return [];
  }
}

export function getLiveShopCatalog(): ShopProduct[] {
  return getShopCatalog().filter((p) => p.status === 'live');
}
