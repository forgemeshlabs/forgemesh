# Blog Post Publishing Checklist

One pass, every post, no steps skipped. Standing rule (operator, 2026-08-21): **cross-post as much as possible.**

## 1. Write the post — TWO LANES (since 2026-08-26)

**Lane A — runtime (DEFAULT, zero rebuild/restart):** for any post the house
template can express (lede, h2 sections, paras with **bold**/links, stat cards,
CTA, related). Write a RuntimePost JSON (schema: `lib/runtime-blog.ts`; example
shape mirrors the template) and publish:
`node scripts/publish-post.mjs <post.json> [hero.png]` — live immediately on
/blog/<slug>, blog index, archive on dynamic pages, and sitemap. Hero is copied
to `content/assets/` and served at `/content/assets/<slug>.png` (bust Cloudflare
with `?v=1` when re-checking after a 404). Skip §3 and the build/restart part of
§4 entirely; still commit `content/` and still do §2 image gen + §5 cross-posts.
Note: archive sidebars on OLD prebuilt posts pick the new post up at the next
full build — acceptable lag. `--unpublish <slug>` reverses a runtime post.

**Lane B — bespoke JSX (rebuild needed):** only when the post needs layout the
template can't do:
- [ ] Copy `app/blog/_template/page.tsx.tpl` → `app/blog/<slug>/page.tsx`
- [ ] Fill every `⟪PLACEHOLDER⟫` (grep for `⟪` — zero left before build)

Both lanes: house voice — field-report first person plural, concrete numbers, no hype. Lede = the hook.

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
      UTM convention (feeds the umami UTM/attribution reports): append
      `?utm_source=<x|pinterest|devto|discord>&utm_medium=social&utm_campaign=<slug>` to the blog URL
      on every channel where the link is clickable. post-social.js already tags the FB link automatically.
- [ ] **Discord** — drop link in the community + kit-buyers channels
- [ ] **Instagram + Facebook Page** (@forgemesh / ForgeMesh Page) — ONE COMMAND via Graph API:
      1. add the post to `scripts/make-pins.py` POSTS (also feeds the IG card), run it AND
         `python3 scripts/make-ig-cards.py` — cards write to `content/assets/pins/` and are
         live IMMEDIATELY at forgemesh.io/content/assets/pins/ig/<slug>.jpg (no rebuild, no
         restart; the scripts read the hero from content/assets/ or public/blog/, whichever exists)
      2. `cd ~/dev/bpp-social && node scripts/post-social.js <slug>` (add `--dry` to preview)
      Posts the 4:5 card to IG + link post to the FB Page, flips the state flags itself.
      Tokens in ~/dev/bpp-social/.env (page token never expires; app "ForgeMesh Publisher").
- [ ] **Pinterest** (GSD Contracts LLC business account, board "AI Agent Economy — Crypto & Payments Explained"):
      1. generate the 2:3 pin card: add the post to `scripts/make-pins.py` POSTS list, run it
         (pin is live immediately at forgemesh.io/content/assets/pins/<slug>.png — no rebuild)
      2. pin via prefilled URL (browser, logged-in Chrome): https://www.pinterest.com/pin/create/button/?url=<blog-url>&media=<pin-image-url>&description=<keyword-rich plain-language description>
      3. click Save on the board. Space pins out — max ~5/day on the board.
- [ ] Anywhere else that fits the post (HN for incident/data posts, relevant subreddits, Moltbook)

## 6. Record
- [ ] Update `~/dev/bpp-social/data/crosspost-state.json` (per-post devto/pinterest/x/instagram/brief flags)
      — feeds the social dashboard at social.backpocketpower.com
- [ ] Note the post + cross-post URLs in the session handoff or memory if it's part of a campaign
