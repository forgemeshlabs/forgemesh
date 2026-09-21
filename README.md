# ForgeMesh

ForgeMesh is a public registry for small, production-running agent commerce systems:
MCP servers, x402-paid APIs, affiliate routing, and machine-readable discovery surfaces.

The ecosystem is built around a simple idea: agents should be able to discover a tool,
understand what it costs, pay for one call, and receive useful output without account
setup or API-key negotiation.

- Website: https://forgemesh.io
- X: https://x.com/forgemeshlabs
- Machine index: https://forgemesh.io/index.json
- LLM overview: https://forgemesh.io/llms.txt
- OpenAPI discovery: https://forgemesh.io/openapi.json
- NPM package: https://www.npmjs.com/package/forgemesh

## Live Projects

| Project | Surface | What it does |
| --- | --- | --- |
| [@forgemeshlabs/kronos-forgemesh-mcp](https://github.com/forgemeshlabs/kronos-forgemesh-mcp) | MCP package + x402 API | Eight paid tools for calibrated crypto ranges, signals, risk context, decision journals, whale flows, and outcome audits. Install with `npx -y @forgemeshlabs/kronos-forgemesh-mcp`. |
| [coinopai-mcp](https://github.com/forgemeshlabs/coinopai-mcp) | MCP package | MCP tools for x402-paid CoinOpAI market intelligence, Kronos signals, trade decisions, and automation prompts. |
| [forgemesh-imagegen](https://github.com/forgemeshlabs/imagegen-mcp) | MCP package | MCP wrapper for x402-paid image generation through the hosted ImageGen API. |
| [@forgemeshlabs/disruption-intelligence-mcp](https://github.com/forgemeshlabs/disruption-intelligence-mcp) | MCP package | MCP wrapper for source-linked WARN, workforce disruption, company, region, territory, watchlist, Ripple Signals, Ripple Paths, and Disruption Intelligence Ripple Reports. |
| [affiliate-router-mcp](https://github.com/forgemeshlabs/affiliate-router-mcp) | MCP package | Vendor-neutral affiliate and payment routing for agent recommendations. |
| [@forgemeshlabs/travel-agent-mcp](https://github.com/forgemeshlabs/travel-agent-mcp) | MCP package + x402 server | Local travel tools and x402 handoffs to ForgeMesh Travel Agent endpoints. |
| [ClawVoice x402](https://github.com/forgemeshlabs/clawvoice-x402) | OpenClaw skill | ClawHub skill for agent voice output, optional push-to-talk input, local x402 wallet setup, spend caps, balance checks, and withdrawal. |
| [@forgemeshlabs/aso-audit-mcp](https://github.com/forgemeshlabs/aso-audit-mcp) | MCP package | Free Agent Signal Optimization scanner for auditing agent readiness across discovery, identity, trust, commerce, reputation, and memory signals. |
| [@forgemeshlabs/aso-score-mcp](https://github.com/forgemeshlabs/aso-score-mcp) | MCP package | ASO Score namespace package for the shared scanner core and 0-100 Agent Readiness Index. |
| [@forgemeshlabs/agent-readiness-mcp](https://github.com/forgemeshlabs/agent-readiness-mcp) | MCP package | Agent Readiness namespace package for agent-friendly website and API checks. |
| [forgemesh](https://github.com/forgemeshlabs/forgemesh) | Umbrella package | Umbrella package and public ecosystem registry. |

## Hosted APIs

| API | Discovery | Notes |
| --- | --- | --- |
| [Kronos by ForgeMesh](https://kronos.forgemesh.io) | [.well-known/x402.json](https://kronos.forgemesh.io/.well-known/x402.json) | Auditable crypto market intelligence from $0.02-$0.15 per call on Base mainnet. |
| [CoinOpAI x402 API](https://x402.coinopai.com) | [index.json](https://x402.coinopai.com/index.json) | Paid crypto intelligence and automation prompt retrieval. |
| [ImageGen x402 API](https://imagegen.coinopai.com) | [index.json](https://imagegen.coinopai.com/index.json) | Paid image generation tiers on Base mainnet. |
| [Disruption Intelligence API](https://disruption.forgemesh.io) | [index.json](https://disruption.forgemesh.io/index.json) | 23 paid endpoints, including Ripple Signals and the Disruption Intelligence Ripple Report, from $0.01-$0.25 per call. |
| [ForgeMesh Travel Agent API](https://travel-agent.forgemesh.io) | [.well-known/x402.json](https://travel-agent.forgemesh.io/.well-known/x402.json) | Paid travel planning awareness endpoints from $0.01-$0.25 per call on Base mainnet. |

## How The Pieces Fit

ForgeMesh services use ordinary web discovery files where possible:

- `index.json` for project and capability metadata
- `llms.txt` for compact LLM-readable context
- `openapi.json` for API discovery
- `/.well-known/x402.json` where paid x402 endpoints are exposed

MCP packages wrap hosted APIs so agents can call paid or free tools from Claude Desktop,
Claude Code, and other MCP-compatible clients. x402 endpoints return an HTTP 402 challenge;
the agent signs a USDC payment on Base mainnet, retries with the payment header, and
receives the paid response.

## Repository Layout

```text
.
├── README.md              # GitHub and npm ecosystem overview
├── CONTRIBUTING.md        # exact install/build/test commands, safe edit areas, troubleshooting
├── OPERATIONS.md          # production deploy and verification runbook
├── package.json           # npm namespace package (metadata only, nothing to run here)
├── architecture.svg       # legacy architecture diagram
└── site/                  # live forgemesh.io Next.js site (all commands run here)
    └── .env.example       # every optional environment variable, documented
```

## Local Site Development

All commands run from `site/`; the repo root has no install or build step.

```bash
cd site
npm install
npm run build      # must pass before any change is considered done
npm run dev        # http://localhost:3000
node --test tests/kronos-checkout.test.cjs
```

No environment variables are needed for a local build. See `site/.env.example` for what each optional one unlocks.

The production site runs from `site/` as the `forgemesh-web` systemd service on the VPS.
See [OPERATIONS.md](OPERATIONS.md) for the deployment and verification runbook and
[CONTRIBUTING.md](CONTRIBUTING.md) for the edit workflow, discovery-file rules, and troubleshooting.

## Troubleshooting Discovery Files

- `llms.txt`, `index.json`, `robots.txt` and the sitemap live in `site/public/` (sitemap in `site/app/sitemap.ts`) and are hand-maintained. If they disagree with a page, fix the file and rebuild.
- Hosted APIs listed in `index.json` are separate services. A 404 or Cloudflare error from one of them is a service issue, not a site build issue. Open an issue with the URL and status code.
- Old content after a successful build is a cache: hard refresh or use a private window before assuming drift.

## License

MIT
