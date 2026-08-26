import type { MetadataRoute } from 'next';
import { allPosts } from '@/lib/runtime-blog';

// Regenerated per-request so runtime-published posts are indexed immediately.
export const dynamic = 'force-dynamic';

const BASE = 'https://forgemesh.io';

// Static routes. New app/<dir>/page.tsx routes must be added here;
// blog posts are picked up automatically from lib/blog.ts.
const STATIC_ROUTES = [
  '/',
  '/402-payment-required',
  '/blog',
  '/botboard',
  '/calendar',
  '/brief',
  '/checklist',
  '/clawvoice',
  '/gov-transparency',
  '/kronos',
  '/mpp',
  '/new-here',
  '/proxy',
  '/scan',
  '/seo',
  '/texas',
  '/watch',
  '/x402',
];

// Non-HTML discovery surfaces we deliberately expose to AI crawlers.
const DISCOVERY_ROUTES = ['/llms.txt', '/index.json', '/.well-known/x402'];

export default function sitemap(): MetadataRoute.Sitemap {
  const POSTS = allPosts();
  const latestPost = POSTS.map((p) => p.date).sort().reverse()[0];

  return [
    ...STATIC_ROUTES.map((path) => ({
      url: `${BASE}${path}`,
      // The homepage and blog index change whenever a post ships.
      ...(path === '/' || path === '/blog' ? { lastModified: latestPost } : {}),
    })),
    ...POSTS.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.date,
    })),
    ...DISCOVERY_ROUTES.map((path) => ({ url: `${BASE}${path}` })),
  ];
}
