# ForgeMesh Site

Marketing site for `forgemesh.io`.

## Purpose

This app is the public landing page for the ForgeMesh ecosystem:
- ForgeMesh Labs positioning and messaging
- live system showcase for active packages and services
- architecture and payment-flow framing for agent commerce

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion

## Local Development

```bash
npm install
npm run dev
```

Default local URL: `http://localhost:3000`

## Production Runtime

On the VPS, the public site is served by `pm2`:

```bash
cd ~/dev/forgemesh/site
npm run build
~/.npm-global/bin/pm2 restart forgemesh-web
```

`forgemesh-web` runs `next start -p 3406` from this directory.

## Important Notes

- This app is part of the main `forgemesh` repo under `site/`
- keep package messaging aligned with the root `README.md`
- avoid generic starter copy or template assets
- if the homepage changes, rebuild before restarting `forgemesh-web`
