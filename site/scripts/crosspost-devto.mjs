#!/usr/bin/env node
// Cross-post a markdown file to dev.to (account: kirothebot) with canonical URL
// pointing at the forgemesh.io original. Standing rule: every blog post gets this.
//
// Usage:
//   node scripts/crosspost-devto.mjs <markdown-file> "<title>" <slug> "tag1,tag2,tag3,tag4"
//
// Key: DEVTO_API_KEY read from ~/.bashrc (never printed).
import { readFileSync } from "fs";
import { homedir } from "os";

const [, , mdFile, title, slug, tagsCsv] = process.argv;
if (!mdFile || !title || !slug) {
  console.error('usage: crosspost-devto.mjs <markdown-file> "<title>" <slug> "tag1,tag2,..."');
  process.exit(1);
}

const bashrc = readFileSync(`${homedir()}/.bashrc`, "utf8");
const m = bashrc.match(/export DEVTO_API_KEY=["']?([^"'\s]+)/);
if (!m) { console.error("DEVTO_API_KEY not found in ~/.bashrc"); process.exit(1); }

const article = {
  article: {
    title,
    published: true,
    body_markdown: readFileSync(mdFile, "utf8"),
    canonical_url: `https://forgemesh.io/blog/${slug}`,
    tags: (tagsCsv || "security,crypto,ai,webdev").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 4),
  },
};

const res = await fetch("https://dev.to/api/articles", {
  method: "POST",
  headers: { "api-key": m[1], "Content-Type": "application/json", "User-Agent": "forgemesh-publisher" },
  body: JSON.stringify(article),
});
const data = await res.json();
if (!res.ok) { console.error("dev.to error", res.status, JSON.stringify(data).slice(0, 300)); process.exit(1); }
console.log("published:", data.url);
