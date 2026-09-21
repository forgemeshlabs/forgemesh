# Contributing to ForgeMesh

This repository holds two things:

- the `forgemesh` npm namespace package at the root (metadata only, publishes `README.md`), and
- the live [forgemesh.io](https://forgemesh.io) site under `site/` (Next.js).

Everything you can run locally lives in `site/`. There is nothing to install or build at the repo root.

## Exact commands

```bash
git clone https://github.com/forgemeshlabs/forgemesh.git
cd forgemesh/site
npm install            # Node 22+
cp .env.example .env.local   # optional; every variable is optional for a local build
npm run build          # production build, must finish with no fatal errors
npm run dev            # local dev server on http://localhost:3000
```

`npm run start` serves the last `npm run build`. Run the checkout test with:

```bash
node --test tests/kronos-checkout.test.cjs
```

There is no root `package.json` script and no root `npm install`. If a guide tells you to run something at the root, it is out of date.

## What runs where

| Path | What it is | Touch it when |
|---|---|---|
| `site/app/` | routes, pages, API handlers | adding or changing a page |
| `site/components/` | shared UI | changing shared layout or sections |
| `site/lib/tools-catalog.ts` | the tools catalog | adding a tool: add a row, nav menus and `/tools` derive from it |
| `site/lib/` | data loaders, feeds, verified-list helpers | changing how data is read |
| `site/content/`, `site/data/` | blog posts and static data | content changes |
| `site/public/` | static files, including discovery files | see below |
| `site/scripts/` | cron jobs run on the production host | never needed for a local build |
| `OPERATIONS.md` | production deploy and verification runbook | deploying |

## Discovery files

Agents and crawlers read these, so keep them in sync with the pages they describe:

- `site/public/llms.txt` — plain-text map of the site for LLM agents
- `site/public/index.json` — machine-readable registry of hosted APIs and MCP servers
- `site/public/robots.txt` and `site/app/sitemap.ts` — crawler surface
- `site/public/partners.json` — generated at runtime by the verified-list sync, not tracked

When you add a page, tool, or hosted API, update `llms.txt` and `index.json` in the same change.

## Environment variables

None are required for `npm run build` or `npm run dev`. `site/.env.example` lists every variable the site reads, what it unlocks, and what happens without it. Never commit `.env.local`.

## Troubleshooting

- **Build passes but a page shows old content.** The site serves a static build. Rebuild, then hard refresh or use a private window. Do not edit anything under `.next/`.
- **`llms.txt` or `index.json` disagree with the live site.** They are hand-maintained; fix the file and rebuild. Compare against `https://forgemesh.io/llms.txt` to see what is deployed.
- **A hosted endpoint listed in `index.json` returns 404 or a bare Cloudflare error.** The endpoint is a separate service; the site only links to it. Open an issue with the URL and the exact status code.
- **Next.js warns about the workspace root.** Harmless; caused by the nested `site/` layout.
- **`next dev` on a production host.** Do not. Verify with `npm run build` plus `curl`; the dev server has taken the production host down before.

## For coding agents

Stack: Next.js 16, React 19, Tailwind v4, TypeScript. Read `site/node_modules/next/dist/docs/` before writing Next.js code; this version differs from older training data.

Safe to edit without asking: `site/app/**`, `site/components/**`, `site/lib/**`, `site/content/**`, `site/public/llms.txt`, `site/public/index.json`.

Ask first: `site/scripts/**` (production crons), `site/next.config.ts`, anything under `site/app/api/` that handles payments, and `OPERATIONS.md`.

Before reporting done: `npm run build` succeeds, the affected page renders in `npm run dev`, and `llms.txt` / `index.json` were updated if you added a surface. Report the exact commands you ran and their output.

## Pull requests

One change per PR. Say what page or file a reviewer should open to see the result. Screenshots help for visual changes. Commit messages describe the change, not the tooling that made it.
