# ForgeMesh Operations

Canonical runbook for operating `forgemesh.io` and the ForgeMesh repo safely.

## Scope

This repo has two distinct responsibilities:

1. Root package (`forgemesh`)
- npm namespace holder and umbrella package
- public README, architecture diagram, npm metadata
- no runtime app logic at repo root

2. Website (`site/`)
- public marketing site for `https://forgemesh.io`
- Next.js 16 App Router app
- deployed on the VPS and kept online with `pm2`

## Canonical Locations

- VPS repo: `/home/ubuntu/dev/forgemesh`
- Website app: `/home/ubuntu/dev/forgemesh/site`
- Public domain: `https://forgemesh.io`
- Process manager: `~/.npm-global/bin/pm2`
- Live process name: `forgemesh-web`
- PM2 working directory: `/home/ubuntu/dev/forgemesh/site`
- PM2 start command: `npm run start -- -p 3406`
- Runtime port: `3406`
- Logs:
  - `/home/ubuntu/.pm2/logs/forgemesh-web-out.log`
  - `/home/ubuntu/.pm2/logs/forgemesh-web-error.log`

## Site Stack

- Next.js `16.2.6`
- React `19.2.4`
- Tailwind CSS v4
- Framer Motion
- Static homepage build served by `next start`

## Source Of Truth

- Website source of truth is the tracked code in `site/`
- The live public site must match a fresh `npm run build` from `site/`
- Do not trust old `.next` output by itself
- Do not trust browser-cached UI if it disagrees with source
- The hero/source-of-truth currently uses `forgemesh init --agent coinopai-mcp`

## Known Drift Trap

A stale build artifact previously showed `forgemesh init --agent payment-router` even though the tracked source in `components/Hero.tsx` used `coinopai-mcp`.

What that means operationally:
- if source and live site disagree, rebuild first
- if your browser disagrees with the rebuilt public site, hard refresh or use a private window
- do not edit `.next` artifacts directly

## Files That Matter Most

Repo root:
- `README.md` — umbrella package public docs
- `CLAUDE.md` — project-local agent guidance (repo-local instructions; currently ignored by git)
- `OPERATIONS.md` — this runbook
- `architecture.svg` — ecosystem diagram
- `package.json` — npm metadata for `forgemesh`

Website:
- `site/app/page.tsx` — homepage composition
- `site/app/layout.tsx` — metadata and shell
- `site/components/Hero.tsx` — hero terminal copy and headline
- `site/components/Projects.tsx` — active systems showcase
- `site/components/*.tsx` — remaining sections
- `site/package.json` — app scripts and dependencies
- `site/next.config.ts` — Next.js runtime/build config
- `site/README.md` — site-focused dev/deploy notes

## Safe Edit Workflow

From the VPS:

```bash
cd ~/dev/forgemesh
```

For website edits:

```bash
cd ~/dev/forgemesh/site
```

Recommended flow:
1. Edit tracked source files only
2. Check git status before building
3. Build from `site/`
4. Restart `forgemesh-web`
5. Verify public site content
6. Commit the repo state
7. Push when ready

## Safe Deploy Workflow

```bash
cd ~/dev/forgemesh/site
npm run build
~/.npm-global/bin/pm2 restart forgemesh-web
```

Then verify:

```bash
curl -sL https://forgemesh.io | grep -o "forgemesh init --agent [^<]*\|Infrastructure for Autonomous Execution" | head
~/.npm-global/bin/pm2 describe forgemesh-web
```

## Safe Verification Checklist

After any deploy, verify all of these:

1. Build completes with no fatal errors
2. `pm2` shows `forgemesh-web` as `online`
3. Public site returns `200`
4. Public HTML reflects the intended hero/product copy
5. No generic `create-next-app` starter copy remains

Useful commands:

```bash
~/.npm-global/bin/pm2 list
~/.npm-global/bin/pm2 describe forgemesh-web
~/.npm-global/bin/pm2 logs forgemesh-web --lines 80 --nostream
curl -sI https://forgemesh.io | sed -n '1,20p'
curl -sL https://forgemesh.io | grep -o "forgemesh init --agent [^<]*\|coinopai-mcp\|payment-router\|create-next-app" | head -n 20
```

## Git Tracking Rules

- Keep the whole website app tracked under `site/`
- Do not leave production edits as untracked VPS-only files
- Commit source before treating a deploy as durable
- `.next/` and `node_modules/` stay untracked
- If the site changed, commit from repo root so the website and umbrella package history stay together

Typical commands:

```bash
cd ~/dev/forgemesh
git status --short
git add site OPERATIONS.md
git commit -m "docs: update forgemesh operations runbook"
git push origin main
```

## Rollback

If a bad deploy goes live:

```bash
cd ~/dev/forgemesh
git log --oneline --decorate -n 10
git checkout <good-commit> -- site OPERATIONS.md CLAUDE.md
cd ~/dev/forgemesh/site
npm run build
~/.npm-global/bin/pm2 restart forgemesh-web
```

Then verify the public site again before making further edits.

## Process Safety Notes

- `forgemesh-web` is a plain `pm2` app, not Docker, not Vercel, not Cloudflare Pages
- public traffic reaches Cloudflare, which proxies to the VPS-backed site
- do not use `pm2 restart ... --update-env` unless you explicitly intend to change runtime env
- do not hand-edit PM2 pid/log files
- do not edit `.next` files as a substitute for changing source

## Troubleshooting

### Public site shows old content
- rebuild from `site/`
- restart `forgemesh-web`
- verify with `curl`
- then hard refresh browser or use incognito

### `pm2` says online but site is wrong
- inspect `components/Hero.tsx` and `components/Projects.tsx`
- rebuild
- verify public HTML via `curl`
- compare source to live output

### Next.js warns about workspace root
- `site/next.config.ts` sets `outputFileTracingRoot: process.cwd()` to keep runtime root explicit
- if warning returns, check for new lockfiles above `site/`

### Generic starter assets/copy reappear
- remove them from tracked source
- rebuild and restart
- commit the cleanup so it cannot drift back in

## Related Site Coordination

- ForgeMesh package and positioning changes can create content drift with the CoinOpAI public site
- If featured offerings or x402-related positioning change here, review the CoinOpAI site for matching updates
- In practice: after updating `site/components/Projects.tsx`, hero copy, or ecosystem/package framing, check whether `coinopai.com` or `x402.coinopai.com` should be updated too
- Treat this as a content-alignment check, not a blocker for every copy tweak

## Cross-Agent Continuity

The matching cross-environment handoff for this setup lives in:
- `~/cc-share/handoff_docs/HANDOFF-2026-05-21-forgemesh-ops.md`

The shared-state summary also belongs in:
- `~/cc-share/STATE.md`

Use those files for continuity across Mac, VPS, Codex, Claude Code, GPT, and other agents.
