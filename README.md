# ForgeMesh

ForgeMesh is a public registry for small, production-running agent commerce systems:
MCP servers, x402-paid APIs, affiliate routing, and machine-readable discovery surfaces.

The ecosystem is built around a simple idea: agents should be able to discover a tool,
understand what it costs, pay for one call, and receive useful output without account
setup or API-key negotiation.

- Website: https://forgemesh.io
- Machine index: https://forgemesh.io/index.json
- LLM overview: https://forgemesh.io/llms.txt
- OpenAPI discovery: https://forgemesh.io/openapi.json
- NPM package: https://www.npmjs.com/package/forgemesh

## Live Projects

| Project | Current version | What it does |
| --- | --- | --- |
| [coinopai-mcp](https://github.com/forgemeshlabs/coinopai-mcp) | `1.2.8` | MCP tools for x402-paid CoinOpAI market intelligence, Kronos signals, trade decisions, and automation prompts. |
| [forgemesh-imagegen](https://github.com/forgemeshlabs/imagegen-mcp) | `1.0.1` | MCP wrapper for x402-paid image generation through the hosted ImageGen API. |
| [@forgemeshlabs/disruption-intelligence-mcp](https://github.com/forgemeshlabs/disruption-intelligence-mcp) | `0.1.4` | MCP wrapper for source-linked WARN, workforce disruption, company, region, territory, watchlist, and gold convergence intelligence. |
| [affiliate-router-mcp](https://github.com/forgemeshlabs/affiliate-router-mcp) | `0.1.6` | Vendor-neutral affiliate and payment routing for agent recommendations. |
| [forgemesh](https://github.com/forgemeshlabs/forgemesh) | `0.1.3` | Umbrella package and public ecosystem registry. |

## Hosted APIs

| API | Discovery | Notes |
| --- | --- | --- |
| [CoinOpAI x402 API](https://x402.coinopai.com) | [index.json](https://x402.coinopai.com/index.json) | Paid crypto intelligence and automation prompt retrieval. |
| [ImageGen x402 API](https://imagegen.coinopai.com) | [index.json](https://imagegen.coinopai.com/index.json) | Paid image generation tiers on Base mainnet. |
| [Disruption Intelligence API](https://disruption.forgemesh.io) | [index.json](https://disruption.forgemesh.io/index.json) | 20 paid commercial intelligence endpoints from $0.01-$0.15 per call. |
| [Fare Intelligence API](https://travel.forgemesh.io) | [index.json](https://travel.forgemesh.io/index.json) | Travel fare intelligence surface. |

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
├── package.json           # npm namespace package
├── architecture.svg       # legacy architecture diagram
└── site/                  # live forgemesh.io Next.js site
```

## Local Site Development

```bash
cd site
npm install
npm run build
npm run dev
```

The production site runs from `site/` behind the `forgemesh-web` PM2 process on the VPS.
See [OPERATIONS.md](OPERATIONS.md) for the deployment and verification runbook.

## License

MIT
