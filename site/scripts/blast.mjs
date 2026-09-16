#!/usr/bin/env node
// One-command cross-post blast for a runtime-lane blog post.
//
//   node scripts/blast.mjs <slug> [--dry] [--skip=devto,x,ig,cards] [--x-text "..."] [--kicker "..."]
//
// Derives everything from content/posts/<slug>.json and runs, idempotently
// (crosspost-state flags already true are skipped):
//   1. dev.to   — markdown adaptation generated from the post JSON → crosspost-devto.mjs
//   2. X        — text from --x-text, else twitterDescription/excerpt trimmed to 280 → post-x.js
//   3. cards    — POSTS entry appended to make-pins.py → make-pins.py + make-ig-cards.py (2:3 pin + 4:5 IG)
//   4. IG (+FB) — post-social.js (FB failure is non-fatal there; operator skipped FB for now)
//   5. Pinterest — prints the prefilled pin URL (CC pins it via Chrome; no public API on this account)
//   6. HN        — prints a suggested title; NEVER submits (operator decision, account risk)
// State: ~/dev/bpp-social/data/crosspost-state.json. Re-run any time to fill gaps.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BPP = "/home/ubuntu/dev/bpp-social";
const STATE = path.join(BPP, "data/crosspost-state.json");
const NODE = process.execPath;
const PY = "python3";
const BASE = "https://forgemesh.io";

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const dry = args.includes("--dry");
const skip = new Set((args.find((a) => a.startsWith("--skip="))?.slice(7) || "").split(",").filter(Boolean));
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
if (!slug) { console.error("usage: blast.mjs <slug> [--dry] [--skip=devto,x,ig,cards] [--x-text \"...\"] [--kicker \"...\"]"); process.exit(1); }

const postPath = path.join(SITE, "content/posts", `${slug}.json`);
if (!fs.existsSync(postPath)) { console.error(`no runtime post at ${postPath} (Lane B posts: write the dev.to markdown by hand, see BLOG-CHECKLIST §5)`); process.exit(1); }
const post = JSON.parse(fs.readFileSync(postPath, "utf8"));
const state = JSON.parse(fs.readFileSync(STATE, "utf8"));
state[slug] ||= {};
const st = state[slug];
const saveState = () => fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + "\n");
const url = (src) => `${BASE}/blog/${slug}?utm_source=${src}&utm_medium=social&utm_campaign=${slug}`;
const run = (cmd, argv, cwd) => {
  if (dry) { console.log(`   [dry] ${path.basename(cmd)} ${argv.map((a) => (a.length > 60 ? a.slice(0, 57) + "…" : a)).join(" ")}`); return { status: 0, out: "" }; }
  const r = spawnSync(cmd, argv, { cwd, encoding: "utf8" });
  const out = (r.stdout || "") + (r.stderr || "");
  return { status: r.status, out };
};
const summary = [];

// ── 1. dev.to ──────────────────────────────────────────────────────────────
function toMarkdown() {
  const md = (t) => t.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1`$2`"); // house italics mark commands/paths → code on dev.to
  const out = [`*Originally published at [forgemesh.io](${url("devto")}).*`, "", md(post.lede), ""];
  for (const s of post.sections) {
    out.push(`## ${s.heading}`, "");
    for (const p of s.paras) out.push(md(p), "");
    if (s.stats?.length) { out.push("| | |", "|---|---|"); for (const x of s.stats) out.push(`| **${x.n}** | ${x.d} |`); out.push(""); }
  }
  if (post.cta) out.push("---", "", `**${post.cta.kicker}.** ${md(post.cta.copy)}`, "");
  return out.join("\n");
}
if (skip.has("devto")) summary.push(["dev.to", "skipped (--skip)"]);
else if (st.devto) summary.push(["dev.to", `already: ${st.devto}`]);
else {
  console.log("1. dev.to");
  const mdFile = path.join(os.tmpdir(), `${slug}.devto.md`);
  fs.writeFileSync(mdFile, toMarkdown());
  const tags = (post.tags || []).slice(0, 4).map((t) => t.replace(/[^a-z0-9]/gi, "")).join(",");
  const r = run(NODE, [path.join(SITE, "scripts/crosspost-devto.mjs"), mdFile, post.title, slug, tags], SITE);
  const m = r.out.match(/published:\s*(\S+)/);
  if (r.status === 0 && m) { st.devto = m[1]; saveState(); summary.push(["dev.to", m[1]]); }
  else summary.push(["dev.to", dry ? "would post" : `FAILED: ${r.out.trim().slice(-200)}`]);
}

// ── 2. X ───────────────────────────────────────────────────────────────────
function xText() {
  if (opt("--x-text")) return opt("--x-text");
  const link = url("x");
  const budget = 280 - 23 - 2; // t.co wraps the URL to 23 chars; blank line before it
  const hook = (post.twitterDescription || post.excerpt || post.title).trim();
  const body = hook.length <= budget ? hook : hook.slice(0, budget - 1).replace(/\s+\S*$/, "") + "…";
  return `${body}\n\n${link}`;
}
if (skip.has("x")) summary.push(["X", "skipped (--skip)"]);
else if (st.x) summary.push(["X", `already: ${st.x === true ? "posted" : st.x}`]);
else {
  console.log("2. X");
  const text = xText();
  const r = run(NODE, [path.join(BPP, "scripts/post-x.js"), text, "--slug", slug, ...(dry ? ["--dry"] : [])], BPP);
  const m = r.out.match(/x ok:\s*(\S+)/);
  if (m) { st.x = m[1]; saveState(); }
  summary.push(["X", m ? m[1] : dry ? `would post (${text.length} chars)` : `FAILED: ${r.out.trim().slice(-160)}`]);
}

// ── 3. cards (pin 2:3 + IG 4:5) ────────────────────────────────────────────
function kicker() {
  if (opt("--kicker")) return opt("--kicker");
  if (post.pinKicker) return post.pinKicker;
  const stats = post.sections.flatMap((s) => s.stats || []).slice(0, 3).map((x) => `${x.n} ${x.d}`.replace(/,.*$/, ""));
  const k = stats.length >= 2 ? stats.join(" · ") : post.excerpt;
  return k.length > 90 ? k.slice(0, 87).replace(/\s+\S*$/, "") + "…" : k;
}
const pinsPy = path.join(SITE, "scripts/make-pins.py");
let cardsOk = true;
if (skip.has("cards")) summary.push(["cards", "skipped (--skip)"]);
else {
  console.log("3. cards");
  let src = fs.readFileSync(pinsPy, "utf8");
  if (!src.includes(`("${slug}",`)) {
    const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const entry = `    ("${slug}", "${esc(post.title)}", "${esc(kicker())}"),\n`;
    if (dry) console.log(`   [dry] append to make-pins.py POSTS: ${entry.trim()}`);
    else { src = src.replace("POSTS = [\n", "POSTS = [\n" + entry); fs.writeFileSync(pinsPy, src); console.log("   POSTS entry added to make-pins.py (commit it)"); }
  }
  const r1 = run(PY, [pinsPy], SITE); const r2 = run(PY, [path.join(SITE, "scripts/make-ig-cards.py")], SITE);
  cardsOk = r1.status === 0 && r2.status === 0;
  const card = `${BASE}/content/assets/pins/ig/${slug}.jpg`;
  let live = "n/a";
  if (!dry) { try { live = String((await fetch(`${card}?v=${Date.now()}`)).status); } catch (e) { live = e.message; } }
  summary.push(["cards", cardsOk ? `pin + IG card generated; IG card ${live}` : `FAILED: ${(r1.out + r2.out).trim().slice(-160)}`]);
}

// ── 4. IG (+FB, non-fatal) ─────────────────────────────────────────────────
if (skip.has("ig")) summary.push(["IG/FB", "skipped (--skip)"]);
else if (st.instagram === true) summary.push(["IG/FB", `already: IG posted${st.fb === true ? ", FB posted" : ""}`]);
else if (!cardsOk) summary.push(["IG/FB", "skipped: cards failed"]);
else {
  console.log("4. Instagram (+ Facebook, non-fatal)");
  const r = run(NODE, [path.join(BPP, "scripts/post-social.js"), slug, ...(dry ? ["--dry"] : [])], BPP);
  const ig = r.out.match(/ig ok:\s*(\S+)/); const fb = r.out.match(/fb (ok|FAIL)[^\n]*/);
  summary.push(["IG/FB", dry ? "would post" : `${ig ? `IG ok ${ig[1]}` : "IG FAILED"}${fb ? ` · ${fb[0].slice(0, 90)}` : ""}`]);
}

// ── 5. Pinterest (Chrome step) ─────────────────────────────────────────────
const pinDesc = `${post.title}. ${post.seoDescription || post.excerpt}`.slice(0, 480);
const pinUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url("pinterest"))}&media=${encodeURIComponent(`${BASE}/content/assets/pins/${slug}.png`)}&description=${encodeURIComponent(pinDesc)}`;
if (st.pinterest === true) summary.push(["Pinterest", "already pinned"]);
else { st.pinterest_url = pinUrl; if (!dry) saveState(); summary.push(["Pinterest", "NOT pinned — open pinterest_url from crosspost-state in Chrome, click card → Save on 'AI Agent Economy' board"]); }

// ── 6. HN (never automatic) ────────────────────────────────────────────────
summary.push(["HN", st.hn ? `already: ${st.hn}` : `not submitted (operator call). Suggested title: "${post.title.replace(/\bAgents\b/, "API clients")}" → ${BASE}/blog/${slug}`]);

console.log(`\nBlast summary for ${slug}${dry ? " (dry run)" : ""}:`);
for (const [k, v] of summary) console.log(`  ${k.padEnd(10)} ${v}`);
