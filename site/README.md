# ForgeMesh Site

Marketing site for `https://forgemesh.io`.

## Purpose

This app is the public landing page for the ForgeMesh ecosystem:
- ForgeMesh Labs positioning and messaging
- active systems showcase
- architecture and payment-flow framing for agent commerce

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion

## Canonical Paths

- App source: `~/dev/forgemesh/site`
- Live process: `forgemesh-web`
- Runtime port: `3406`
- Domain: `https://forgemesh.io`

## Local Development

```bash
npm install
npm run dev
```

Default local URL: `http://localhost:3000`

## Production Deploy

```bash
npm run build
~/.npm-global/bin/pm2 restart forgemesh-web
```

## Verify Deploy

```bash
curl -sI https://forgemesh.io | sed -n '1,20p'
curl -sL https://forgemesh.io | grep -o "forgemesh init --agent [^<]*\|Infrastructure for Autonomous Execution\|create-next-app" | head -n 20
~/.npm-global/bin/pm2 describe forgemesh-web
```

## Safety Rules

- edit tracked source only
- do not edit `.next/` directly
- rebuild before restart
- verify the public site after restart
- commit changes from repo root so the site state is durable

## Related Site Note

If the featured offerings, versions, or ecosystem framing change here, review the CoinOpAI site for matching public-facing updates.

## Full Runbook

See `../OPERATIONS.md` for the full operating runbook, rollback flow, and tracking rules.
