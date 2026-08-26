#!/usr/bin/env node
// Zero-restart blog publisher. Drops a post into content/ where the dynamic
// app/blog/[slug] route, blog index, archive, and sitemap pick it up at
// request time — live immediately, no build, no restart.
//
// Usage:
//   node scripts/publish-post.mjs <post.json> [hero-image]
//     post.json  — RuntimePost (see lib/runtime-blog.ts). Required fields
//                  checked below. "image" may be omitted when a hero-image
//                  file is passed: it's copied to content/assets/<slug>.<ext>
//                  and wired as /content/assets/<slug>.<ext> automatically.
//   node scripts/publish-post.mjs --unpublish <slug>
//     Removes the post + registry entry (runtime posts only).
//
// Posts published here render through the shared house template. A post that
// needs bespoke JSX still goes the classic route (app/blog/<slug>/page.tsx +
// lib/blog.ts + rebuild), which permanently shadows the runtime version.
// Commit content/ after publishing — it's versioned content, and the next
// full build bakes the then-current registry into the static pages' sidebars.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SITE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(SITE, 'content');
const REGISTRY = path.join(CONTENT, 'registry.json');

const REQUIRED = ['slug', 'date', 'title', 'excerpt', 'tags', 'description', 'seoTitle', 'seoDescription', 'heroAlt', 'lede', 'sections'];

const args = process.argv.slice(2);
const loadRegistry = () => JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const saveRegistry = (r) => fs.writeFileSync(REGISTRY, JSON.stringify(r, null, 2));

if (args[0] === '--unpublish') {
  const slug = args[1];
  if (!slug) { console.error('usage: publish-post.mjs --unpublish <slug>'); process.exit(1); }
  saveRegistry(loadRegistry().filter((p) => p.slug !== slug));
  fs.rmSync(path.join(CONTENT, 'posts', `${slug}.json`), { force: true });
  console.log(`unpublished ${slug} (assets under content/assets left in place)`);
  process.exit(0);
}

const [postFile, heroFile] = args;
if (!postFile) { console.error('usage: publish-post.mjs <post.json> [hero-image]'); process.exit(1); }
const post = JSON.parse(fs.readFileSync(postFile, 'utf8'));

const missing = REQUIRED.filter((f) => post[f] === undefined || post[f] === null || post[f] === '');
if (missing.length) { console.error('missing required fields:', missing.join(', ')); process.exit(1); }
if (!/^[a-z0-9-]+$/.test(post.slug)) { console.error('slug must be kebab-case [a-z0-9-]'); process.exit(1); }
if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) { console.error('date must be YYYY-MM-DD'); process.exit(1); }
if (!Array.isArray(post.sections) || !post.sections.length) { console.error('sections must be a non-empty array'); process.exit(1); }
if (post.seoTitle.length > 60) console.warn(`warn: seoTitle is ${post.seoTitle.length} chars (target <=60)`);
if (post.seoDescription.length > 155) console.warn(`warn: seoDescription is ${post.seoDescription.length} chars (target <=155)`);

if (heroFile) {
  const ext = path.extname(heroFile).toLowerCase() || '.png';
  const dest = path.join(CONTENT, 'assets', `${post.slug}${ext}`);
  fs.copyFileSync(heroFile, dest);
  post.image = `/content/assets/${post.slug}${ext}`;
  console.log(`hero: ${dest} -> ${post.image}`);
}

fs.writeFileSync(path.join(CONTENT, 'posts', `${post.slug}.json`), JSON.stringify(post, null, 2));

const registry = loadRegistry().filter((p) => p.slug !== post.slug);
registry.unshift({
  slug: post.slug,
  date: post.date,
  title: post.title,
  excerpt: post.excerpt,
  image: post.image,
  tags: post.tags,
});
saveRegistry(registry);

console.log(`published: https://forgemesh.io/blog/${post.slug}`);
console.log('live immediately — no build or restart. Verify:');
console.log(`  curl -s https://forgemesh.io/blog/${post.slug} | grep -o '<h1[^>]*>.*</h1>' | head -1`);
