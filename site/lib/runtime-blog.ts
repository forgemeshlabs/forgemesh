// Runtime blog content — posts published AFTER the last build, no rebuild needed.
//
// Next's production server freezes routes and the public/ file list at build
// time, but it reads *existing* files and runs dynamic segments per-request.
// This module is the bridge: posts dropped into content/ by
// scripts/publish-post.mjs are picked up at request time by the dynamic
// app/blog/[slug] route, the blog index, the archive sidebar, and the sitemap.
//
// content/
//   registry.json   — BlogPost[] (newest first), merged with compiled POSTS
//   posts/<slug>.json — full post body (RuntimePost)
//   assets/<file>   — heroes/cards added post-build, served by app/content/[...path]
import fs from 'fs';
import path from 'path';
import { POSTS, type BlogPost } from '@/lib/blog';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export type RuntimeSection = {
  heading: string;
  paras: string[];
  stats?: { n: string; d: string }[];
};

export type RuntimePost = BlogPost & {
  description: string;
  seoTitle: string;
  seoDescription: string;
  twitterTitle?: string;
  twitterDescription?: string;
  heroAlt: string;
  breadcrumb?: string;
  lede: string;
  sections: RuntimeSection[];
  cta?: { kicker: string; copy: string } | null;
  related?: { slug: string; text: string }[];
};

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
  } catch {
    return null;
  }
}

// Compiled registry + runtime registry, newest first. Compiled entries win on
// slug collisions (a built page always shadows the dynamic route anyway).
export function allPosts(): BlogPost[] {
  const runtime = readJson<BlogPost[]>(path.join(CONTENT_DIR, 'registry.json')) || [];
  const compiled = new Set(POSTS.map((p) => p.slug));
  const merged = [...runtime.filter((p) => p.slug && !compiled.has(p.slug)), ...POSTS];
  return merged.slice().sort((a, b) => b.date.localeCompare(a.date));
}

export function loadRuntimePost(slug: string): RuntimePost | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  return readJson<RuntimePost>(path.join(CONTENT_DIR, 'posts', `${slug}.json`));
}

export function assetPath(...segments: string[]): string | null {
  const resolved = path.resolve(CONTENT_DIR, 'assets', ...segments);
  if (!resolved.startsWith(path.resolve(CONTENT_DIR, 'assets') + path.sep)) return null;
  return resolved;
}
