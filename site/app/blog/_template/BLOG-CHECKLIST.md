# Blog Post Publishing Checklist

One pass, every post, no steps skipped. Standing rule (operator, 2026-08-21): **cross-post as much as possible.**

## 1. Write the post
- [ ] Copy `app/blog/_template/page.tsx.tpl` → `app/blog/<slug>/page.tsx`
- [ ] Fill every `⟪PLACEHOLDER⟫` (grep for `⟪` — zero left before build)
- [ ] House voice: field-report first person plural, concrete numbers, no hype. Lede = the hook.

## 2. Hero image (every post gets one)
- [ ] 16:9 PNG at `public/blog/<slug>.png` (min 1200×675)
- [ ] Option A — generate with our own ImageGen ($0.25 paid x402 call, dogfoods the fleet):
      pattern in scratchpad `imagegen-hero.mjs` — pay `https://imagegen.coinopai.com/generate?prompt=…&aspect=16:9`
      with the fleet payer key from `~/dev/x402-services/.env`, download `image_url`, convert webp→png.
      Style prompt base: "minimalist editorial tech illustration, dark navy background, glowing blue accent, cinematic lighting, no text"
- [ ] Option B — any PNG dropped in place (screenshots, charts)
- [ ] View the image before shipping (Read tool) — regenerate if off-brand
- [ ] Accessibility pass: meaningful `alt` on the hero (describe the scene, not "hero image"),
      headings in order (one h1, h2 sections), links make sense out of context, no info conveyed
      by color alone

## 3. Register the post
- [ ] Add entry to `lib/blog.ts` POSTS array (top = newest): slug, date, title, excerpt, image, **tags**
      (3-4 lowercase topic tags; must match the TAGS const in the post page — they render as chips
      on the index + inline archive and feed meta keywords / OG article:tag / JSON-LD)
- [ ] (sitemap, blog index, and archive sidebars all update automatically from POSTS —
      `app/sitemap.ts` generates /sitemap.xml; only new NON-blog pages need adding there)
- [ ] SEO metadata split: top-level `metadata.title` ≤ 60 chars incl. " | ForgeMesh" suffix,
      `metadata.description` ≤ 155 chars, keyword up front. Keep the punchy editorial headline
      for the on-page h1 and openGraph/twitter titles — search gets the short version, humans
      and social get the long one.

## 4. Ship
- [ ] `cd ~/dev/forgemesh/site && npm run build` — new route must appear in output
- [ ] `fleet restart forgemesh-web`
- [ ] `curl -s https://forgemesh.io/blog/<slug> | grep -o '<headline fragment>'` — verify live HTML
- [ ] Commit (NO AI co-author trailers — repo hook blocks them)

## 5. Cross-post (standing rule — all of these, every time)
- [ ] **Generate the social kit with the Opal ForgeMesh Social Amplifier** (fastest path):
      https://opal.google/edit/1ZLUcBVmu3IP4cJxRU0i9UabD4FNHhOVY (clawdbotworker Google account, private)
      — input the blog URL + optional angle; outputs X thread, X post, IG caption, carousel copy,
      LinkedIn post, HN title as copy-ready blocks. Or write the kit manually (pattern:
      ~/cc-share/x402/social/). Pomelli (labs.google.com/u/0/pomelli) holds branded ForgeMesh
      image creatives — campaign "The Architects of Autonomy" — for IG visuals.
- [ ] **dev.to** (account: kirothebot, canonical → forgemesh.io):
      `node scripts/crosspost-devto.mjs <markdown-file> "<title>" <slug> "tag1,tag2,tag3,tag4"`
      Write a markdown adaptation first (plain prose, code fences fine; strip JSX-isms).
- [ ] **X/@forgemeshlabs** — thread or single post; hook + link. (x-twitter-growth skill for format.)
- [ ] **Discord** — drop link in the community + kit-buyers channels
- [ ] **Instagram** (@forgemesh, hello@forgemesh.io → clawdbotworker@gmail.com) — hero image + carousel
      of the key points as image cards; link in bio. (Manual until Graph API is wired.)
- [ ] **Pinterest** (GSD Contracts LLC business account, board "AI Agent Economy — Crypto & Payments Explained"):
      1. generate the 2:3 pin card: add the post to `scripts/make-pins.py` POSTS list, run it, rebuild+restart (pin lands at forgemesh.io/blog/pins/<slug>.png)
      2. pin via prefilled URL (browser, logged-in Chrome): https://www.pinterest.com/pin/create/button/?url=<blog-url>&media=<pin-image-url>&description=<keyword-rich plain-language description>
      3. click Save on the board. Space pins out — max ~5/day on the board.
- [ ] Anywhere else that fits the post (HN for incident/data posts, relevant subreddits, Moltbook)

## 6. Record
- [ ] Note the post + cross-post URLs in the session handoff or memory if it's part of a campaign
