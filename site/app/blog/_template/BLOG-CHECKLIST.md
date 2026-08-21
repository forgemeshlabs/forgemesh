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

## 3. Register the post
- [ ] Add entry to `lib/blog.ts` POSTS array (top = newest): slug, date, title, excerpt, image
- [ ] Add `<url>` block to `public/sitemap.xml` (copy an existing blog entry, newest first)
- [ ] (blog index and archive sidebars update automatically from POSTS)

## 4. Ship
- [ ] `cd ~/dev/forgemesh/site && npm run build` — new route must appear in output
- [ ] `fleet restart forgemesh-web`
- [ ] `curl -s https://forgemesh.io/blog/<slug> | grep -o '<headline fragment>'` — verify live HTML
- [ ] Commit (NO AI co-author trailers — repo hook blocks them)

## 5. Cross-post (standing rule — all of these, every time)
- [ ] **dev.to** (account: kirothebot, canonical → forgemesh.io):
      `node scripts/crosspost-devto.mjs <markdown-file> "<title>" <slug> "tag1,tag2,tag3,tag4"`
      Write a markdown adaptation first (plain prose, code fences fine; strip JSX-isms).
- [ ] **X/@forgemeshlabs** — thread or single post; hook + link. (x-twitter-growth skill for format.)
- [ ] **Discord** — drop link in the community + kit-buyers channels
- [ ] **Instagram** (@forgemesh, hello@forgemesh.io → clawdbotworker@gmail.com) — hero image + carousel
      of the key points as image cards; link in bio. (Manual until Graph API is wired.)
- [ ] Anywhere else that fits the post (HN for incident/data posts, relevant subreddits, Moltbook)

## 6. Record
- [ ] Note the post + cross-post URLs in the session handoff or memory if it's part of a campaign
