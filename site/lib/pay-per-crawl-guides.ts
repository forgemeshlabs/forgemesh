// Setup guides, one per stack, rendered at /plugins/<slug>. Content mirrors each package README;
// when a README changes, change it here too. Transaction hashes are real Base mainnet settlements.
export type Guide = {
  slug: string;
  name: string;
  title: string;
  pitch: string;
  stacks: string;
  version: string;
  registry: { label: string; url: string };
  repo: string;
  install: string;
  snippets: { label: string; file?: string; lang: string; code: string }[];
  env: [string, string][];
  steps: string[];
  gotchas: string[];
  settlements: [string, string][];
  more?: { label: string; url: string }[];
};

const ENV_JS: [string, string][] = [
  ['PAY_TO', 'Your 0x wallet on Base. Required to charge.'],
  ['PRICE_USD', 'Price per page fetch in USDC. Default 0.01, minimum 0.005.'],
  ['MODE', 'monitor (default) logs what bots would have paid; gate answers 402.'],
  ['FACILITATOR_URL', 'Any x402 facilitator that settles on Base. Default PayAI, no API key.'],
  ['CLASS_POLICY', 'JSON per class: search, social, monitor, seo, ai, automation, bot → free, paid or block.'],
  ['BOT_OVERRIDES', 'JSON per crawler name, wins over the class: {"GPTBot":"paid","Bytespider":"block"}.'],
  ['ALLOW_PATHS', 'Comma list of path prefixes that are never gated.'],
  ['TRUST_HEADER', 'Header carrying the real client IP behind your proxy. Right-most entry is used.'],
  ['MPP_SECRET', 'Long random string signing MPP challenges. Set it so challenges survive restarts.'],
  ['PRO_KEY', 'Optional Pay-per-Crawl Pro license for the hosted dashboard.'],
];

const COMMON_GOTCHAS = [
  'Behind Cloudflare, set AI Crawl Control and any "Block AI bots" rule to Allow for the crawlers you want to charge. A crawler blocked at the edge never reaches the gate and never sees the 402.',
  'Humans never see a 402. Search engines are verified by reverse DNS; a request that only claims to be Googlebot is charged.',
  'Start in monitor mode. It logs every bot with what it would have paid and never blocks. Switch to gate when the numbers make sense.',
];

export const GUIDES: Guide[] = [
  {
    slug: 'nextjs',
    name: 'Next.js',
    title: 'Charge AI crawlers on a Next.js site',
    pitch: 'Edge-runtime middleware for Next 14, 15 and 16. Humans and verified search engines read free; AI crawlers get a 402 and pay per page in USDC on Base, straight to your wallet.',
    stacks: 'Next.js 14 / 15 middleware, Next 16 proxy, Vercel or self-hosted',
    version: '0.1.2',
    registry: { label: 'npm', url: 'https://www.npmjs.com/package/@forgemeshlabs/pay-per-crawl-next' },
    repo: 'https://github.com/forgemeshlabs/pay-per-crawl-js/tree/main/packages/next',
    install: 'npm install @forgemeshlabs/pay-per-crawl-next',
    snippets: [
      { label: 'middleware.js (Next 14 / 15)', file: 'middleware.js', lang: 'js', code: `import { createPayPerCrawl } from "@forgemeshlabs/pay-per-crawl-next";
const ppc = createPayPerCrawl({ siteName: "My Site" }); // PAY_TO, PRICE_USD, MODE come from env; options win
export const middleware = ppc.middleware;
// Next needs config as a literal in this file; it cannot be re-exported.
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };` },
      { label: 'proxy.js (Next 16)', file: 'proxy.js', lang: 'js', code: `import { createPayPerCrawl } from "@forgemeshlabs/pay-per-crawl-next";
const ppc = createPayPerCrawl({ siteName: "My Site" });
export const proxy = ppc.proxy;
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };` },
    ],
    env: ENV_JS,
    steps: [
      'Install the package and add the middleware file at the project root.',
      'Set PAY_TO and PRICE_USD in your environment. Leave MODE unset, which means monitor.',
      'Deploy and watch the function logs: each bot is logged with its class and what it would have paid.',
      'Set MODE=gate and redeploy to start charging.',
    ],
    gotchas: [
      'On Vercel the platform sets X-Forwarded-For; the gate reads the right-most entry. If your server is exposed directly, pass trustHeader: "" so a client cannot forge an IP.',
      'The replay lock and the reverse-DNS cache are per-process memory. Pass a store (any object with get, put, delete) to share them across instances. The on-chain nonce is the hard guard either way.',
      'The middleware also serves /.well-known/x402.json, /llms.txt and /agents.txt. Route handlers for them are exported if you prefer.',
      ...COMMON_GOTCHAS,
    ],
    settlements: [
      ['x402 v1 (X-PAYMENT, stock x402-fetch 1.x)', '0x5eb3ae89264f754793de655ade581cf9e4b885946d415d1d29d8d9e079077e7c'],
      ['x402 v2 (PAYMENT-SIGNATURE, @x402/core)', '0x6f6e08909ef5e70e023649501721536e5e619a1008e2446f8a02830fdcc066c1'],
    ],
  },
  {
    slug: 'vercel',
    name: 'Vercel',
    title: 'Charge AI crawlers on any site hosted on Vercel',
    pitch: 'One Edge Middleware file in front of whatever Vercel serves: a static site, Astro, SvelteKit, Vite, Nuxt, Remix, Hugo, Docusaurus. No server needed. Next.js projects use the Next.js guide instead.',
    stacks: 'Vercel Edge Middleware, any framework except Next.js',
    version: '0.1.0',
    registry: { label: 'npm', url: 'https://www.npmjs.com/package/@forgemeshlabs/pay-per-crawl-vercel' },
    repo: 'https://github.com/forgemeshlabs/pay-per-crawl-js/tree/main/packages/vercel',
    install: 'npm install @forgemeshlabs/pay-per-crawl-vercel',
    snippets: [
      { label: 'middleware.js at the project root', file: 'middleware.js', lang: 'js', code: `import { createPayPerCrawl } from "@forgemeshlabs/pay-per-crawl-vercel";
const ppc = createPayPerCrawl({ siteName: "My Site" });
export default ppc.middleware;
// Vercel needs config as a literal in this file; it cannot be re-exported.
export const config = { matcher: ["/((?!_vercel|favicon.ico).*)"] };` },
      { label: 'vercel.json for a plain static folder', file: 'vercel.json', lang: 'json', code: `{ "outputDirectory": "public" }` },
    ],
    env: ENV_JS,
    steps: [
      'Add a package.json with the dependency if your project is pure static HTML, then install.',
      'Add middleware.js next to package.json. A static project also needs vercel.json pointing outputDirectory at your HTML folder.',
      'In the Vercel project settings add PAY_TO and PRICE_USD, then deploy. Env vars apply from the next deployment.',
      'Test on the production alias (your-project.vercel.app): curl -i -A GPTBot https://your-project.vercel.app/ returns 402.',
      'Set MODE=gate and redeploy to start charging.',
    ],
    gotchas: [
      'Per-deployment URLs (your-project-abc123-team.vercel.app) sit behind Vercel Authentication by default and answer 302 to a login page. Test the production alias or a custom domain.',
      'Vercel appends the client IP to X-Forwarded-For; the gate reads the right-most entry, so a client cannot prepend a search-engine IP.',
      'Edge Middleware runs on every matched request, paying or not. Hobby has a generous allowance; paid plans meter invocations.',
      'Replay lock and reverse-DNS cache are per-isolate memory. Pass a store such as Vercel KV for a shared one.',
      ...COMMON_GOTCHAS,
    ],
    settlements: [
      ['x402 v2 through a static site on Vercel (ppc-vercel-demo.vercel.app)', '0xcc37097ef97b74f5ff0361cc98344bffce8fbba48bfdf3354c9094b1eec93766'],
    ],
    more: [{ label: 'Live demo (GPTBot gets a 402)', url: 'https://ppc-vercel-demo.vercel.app/' }],
  },
  {
    slug: 'cloudflare-workers',
    name: 'Cloudflare Workers',
    title: 'Charge AI crawlers with a Cloudflare Worker in front of any site',
    pitch: 'A Worker on your zone, a custom domain, or workers.dev in front of any origin. Deploys in five minutes, no change to the site behind it.',
    stacks: 'Cloudflare Workers, any origin, Cloudflare Pages',
    version: '0.1.2',
    registry: { label: 'npm', url: 'https://www.npmjs.com/package/@forgemeshlabs/pay-per-crawl-worker' },
    repo: 'https://github.com/forgemeshlabs/pay-per-crawl-js/tree/main/packages/cloudflare-worker',
    install: 'npm install @forgemeshlabs/pay-per-crawl-worker',
    snippets: [
      { label: 'src/worker.js', file: 'src/worker.js', lang: 'js', code: `export { default } from "@forgemeshlabs/pay-per-crawl-worker";` },
      { label: 'wrangler.toml (excerpt)', file: 'wrangler.toml', lang: 'toml', code: `name = "pay-per-crawl"
main = "src/worker.js"
routes = [{ pattern = "example.com/*", zone_name = "example.com" }]

[vars]
PAY_TO = "0xYourWalletOnBase"
PRICE_USD = "0.01"
MODE = "monitor"
# npx wrangler secret put MPP_SECRET` },
    ],
    env: [...ENV_JS, ['ORIGIN_URL', 'Rewrite requests to this origin (workers.dev setups). Otherwise the Worker fetches the zone origin.'], ['PPC_KV', 'Optional KV binding: shared replay lock across isolates. Bind it for production gating.'], ['PPC_ANALYTICS', 'Optional Workers Analytics Engine binding: one data point per bot request.']],
    steps: [
      'Turn Cloudflare\'s own bot blocking off for the zone: "Block AI bots", AI Crawl Control and "Pay per crawl". Otherwise crawlers are stopped before they reach the Worker.',
      'Install the package, add the one-line worker file and the wrangler.toml, set PAY_TO and your route.',
      'npx wrangler secret put MPP_SECRET, then npx wrangler deploy.',
      'Leave MODE at monitor for a few days and read the logs. Then set MODE = "gate" and redeploy.',
    ],
    gotchas: [
      'TRUST_HEADER defaults to cf-connecting-ip, which Cloudflare sets. Leave it.',
      'Without a KV binding the replay lock is per-isolate memory, fine for monitor mode and low traffic. Bind KV before gating real traffic.',
      'The Worker appends discovery pointers to your robots.txt and serves the three discovery files itself.',
      ...COMMON_GOTCHAS.slice(1),
    ],
    settlements: [
      ['Same core as the Next.js edition; mainnet hashes on that guide', ''],
    ],
  },
  {
    slug: 'node',
    name: 'Node',
    title: 'Charge AI crawlers in Express, Fastify, Hono or Koa',
    pitch: 'One adapter package for the four common Node servers. Mount it before your routes and every page is gated the same way.',
    stacks: 'Express, Fastify, Hono (Node, Bun, Deno, Workers), Koa',
    version: '0.1.2',
    registry: { label: 'npm', url: 'https://www.npmjs.com/package/@forgemeshlabs/pay-per-crawl-node' },
    repo: 'https://github.com/forgemeshlabs/pay-per-crawl-js/tree/main/packages/node',
    install: 'npm install @forgemeshlabs/pay-per-crawl-node',
    snippets: [
      { label: 'Express', lang: 'js', code: `import { payPerCrawl } from "@forgemeshlabs/pay-per-crawl-node/express";
app.use(payPerCrawl({ payTo: "0xYourWallet", mode: "monitor" })); // before your routes` },
      { label: 'Fastify', lang: 'js', code: `import { payPerCrawl } from "@forgemeshlabs/pay-per-crawl-node/fastify";
await app.register(payPerCrawl, { payTo: "0xYourWallet", mode: "gate" });` },
      { label: 'Hono', lang: 'js', code: `import { payPerCrawl } from "@forgemeshlabs/pay-per-crawl-node/hono";
app.use("*", payPerCrawl({ payTo: "0xYourWallet" }));` },
      { label: 'Koa', lang: 'js', code: `import { payPerCrawl } from "@forgemeshlabs/pay-per-crawl-node/koa";
app.use(payPerCrawl({ payTo: "0xYourWallet" }));` },
    ],
    env: ENV_JS,
    steps: [
      'Install the package and mount the adapter for your framework before your routes.',
      'Pass payTo and priceUsd as options, or set PAY_TO and PRICE_USD in the environment.',
      'Run in monitor mode first and read the per-request events, then set mode: "gate".',
    ],
    gotchas: [
      'Express, Fastify and Koa verify search engines with Node DNS. Hono uses DNS-over-HTTPS so it also runs on edge runtimes.',
      'Set trustHeader only to a header your own proxy overwrites or appends, such as x-forwarded-for behind nginx. Without it the socket address is used.',
      'Replay lock is in memory per process. Pass a store to share it across instances.',
      ...COMMON_GOTCHAS,
    ],
    settlements: [
      ['Same core as the Next.js edition; mainnet hashes on that guide', ''],
    ],
  },
  {
    slug: 'nginx',
    name: 'nginx',
    title: 'Charge AI crawlers at nginx with an njs script',
    pitch: 'A config snippet, not a package. The njs script issues the 402, accepts the payment, has the facilitator settle it, and proxies to your origin only on a transaction hash.',
    stacks: 'nginx with ngx_http_js_module, njs 0.8.0 or newer',
    version: 'snippet',
    registry: { label: 'nginx/ in the JS repo', url: 'https://github.com/forgemeshlabs/pay-per-crawl-js/tree/main/nginx' },
    repo: 'https://github.com/forgemeshlabs/pay-per-crawl-js/tree/main/nginx',
    install: 'apt install nginx-module-njs   # from the nginx.org repository',
    snippets: [
      { label: 'nginx.conf (excerpt; full example in the repo)', file: 'nginx.conf', lang: 'nginx', code: `load_module modules/ngx_http_js_module.so;
http {
  js_path "/etc/nginx/njs/";
  js_import ppc from pay-per-crawl.js;
  js_shared_dict_zone zone=ppc_locks:1m timeout=600s evict;
  resolver 1.1.1.1;
  server {
    set $ppc_pay_to "0xYourWalletOnBase";
    set $ppc_price_usd "0.01";
    set $ppc_mode "monitor";
    set $ppc_mpp_secret "long-random-string";
    location / { js_content ppc.handle; }
    location @origin { proxy_pass http://127.0.0.1:8080; }
  }
}` },
    ],
    env: [
      ['ppc_pay_to', 'Your 0x wallet on Base.'],
      ['ppc_price_usd', 'Price per page, default 0.01, minimum 0.005.'],
      ['ppc_mode', 'monitor or gate.'],
      ['ppc_class_policy / ppc_bot_overrides', 'JSON policy per class and per crawler.'],
      ['ppc_trust_header', 'Header with the real client IP if nginx sits behind another proxy. Right-most entry used.'],
      ['ppc_doh_url', 'DNS-over-HTTPS resolver for search-engine verification.'],
      ['ppc_mpp_secret', 'Long random string signing MPP challenges.'],
    ],
    steps: [
      'Install the njs module and copy pay-per-crawl.js to /etc/nginx/njs/.',
      'Merge nginx.conf.example into your config: wallet, secret, upstream, mode monitor.',
      'nginx -t && nginx -s reload, then curl -i -A GPTBot https://your-site/ and expect 402.',
      'Set ppc_mode "gate" when ready.',
    ],
    gotchas: [
      'Needs resolver and js_fetch_trusted_certificate for the HTTPS calls to the facilitator and the DoH resolver.',
      'Log variables $ppc_status, $ppc_class, $ppc_bot, $ppc_tx and $ppc_reason are available to log_format.',
      'The Pro reporter is not included in this edition.',
      ...COMMON_GOTCHAS,
    ],
    settlements: [
      ['Tested with the 37-check curl matrix and a mock facilitator on nginx 1.26 / njs 0.8.9; wire code shared with the Node edition', ''],
    ],
  },
  {
    slug: 'python',
    name: 'Python',
    title: 'Charge AI crawlers in FastAPI, Flask or Django',
    pitch: 'One package, three adapters: ASGI for FastAPI and Starlette, WSGI for Flask and anything else, and a Django middleware. Python 3.10+, one dependency.',
    stacks: 'FastAPI, Starlette, Flask, any WSGI app, Django',
    version: '0.1.2',
    registry: { label: 'PyPI', url: 'https://pypi.org/project/forgemesh-pay-per-crawl/' },
    repo: 'https://github.com/forgemeshlabs/pay-per-crawl-py',
    install: 'pip install forgemesh-pay-per-crawl',
    snippets: [
      { label: 'FastAPI / Starlette', lang: 'python', code: `from forgemesh_pay_per_crawl import Config
from forgemesh_pay_per_crawl.asgi import PayPerCrawlMiddleware

app.add_middleware(PayPerCrawlMiddleware,
    config=Config(pay_to="0xYourWalletOnBase", mode="gate", price_usd=0.01, base_url="https://example.com"))` },
      { label: 'Flask (and any WSGI app)', lang: 'python', code: `from forgemesh_pay_per_crawl import Config
from forgemesh_pay_per_crawl.wsgi import PayPerCrawlWSGI

app.wsgi_app = PayPerCrawlWSGI(app.wsgi_app,
    Config(pay_to="0xYourWalletOnBase", mode="gate", price_usd=0.01, base_url="https://example.com"))` },
      { label: 'Django settings.py', file: 'settings.py', lang: 'python', code: `MIDDLEWARE = ["forgemesh_pay_per_crawl.django.PayPerCrawlMiddleware", *MIDDLEWARE]  # near the top
PAY_PER_CRAWL = {"pay_to": "0xYourWalletOnBase", "mode": "gate", "price_usd": 0.01, "base_url": "https://example.com"}` },
    ],
    env: [
      ['pay_to', 'Your 0x wallet on Base. Required in gate mode.'],
      ['mode', '"monitor" (default) records only; "gate" answers 402.'],
      ['price_usd', 'Price per page fetch, default 0.01, minimum 0.005.'],
      ['facilitator_url', 'Any x402 facilitator that settles on Base. Default PayAI, no key.'],
      ['class_policy / bot_overrides', 'Per class and per crawler: "free", "paid" or "block".'],
      ['allow_paths', 'Path prefixes never gated. robots.txt, sitemaps, llms.txt, agents.txt and /.well-known/ always are.'],
      ['base_url', 'Your public origin. Set it behind a proxy or load balancer.'],
      ['trust_proxy_header', 'Header with the real client IP ("CF-Connecting-IP", "X-Forwarded-For"). Right-most entry used.'],
      ['mpp_secret', 'Stable HMAC key for MPP challenge ids. Set it when you run more than one worker.'],
    ],
    steps: [
      'pip install the package and add the adapter for your framework.',
      'Start with mode="monitor" and pass base_url if you are behind a proxy.',
      'Read the on_event callback or your logs for a day, then switch to mode="gate".',
    ],
    gotchas: [
      'With several worker processes, pass lock=FileNonceLock("/var/tmp/fmppc") so a payment cannot be replayed on another worker, and set a stable mpp_secret.',
      'Gate.handle is blocking because it can call the facilitator. In async code run it in a thread, as the ASGI middleware does.',
      ...COMMON_GOTCHAS,
    ],
    settlements: [
      ['x402 v1', '0x49f0f05b3509545e5134aa6cf091ff7eab4e4f1e1b9aef9bf28280c231e2a945'],
      ['x402 v2', '0x15d95ad90c9530e4816016f65681ddd4a79730373634c991c57afa2b88a8b44b'],
    ],
  },
  {
    slug: 'go',
    name: 'Go',
    title: 'Charge AI crawlers in Go, Caddy or Traefik',
    pitch: 'One Go module with a net/http middleware, a Caddy handler module and a Traefik plugin. Pure-Go keccak so the core loads inside Traefik\'s interpreter.',
    stacks: 'net/http, Caddy module http.handlers.pay_per_crawl, Traefik plugin',
    version: '0.1.1',
    registry: { label: 'pkg.go.dev', url: 'https://pkg.go.dev/github.com/forgemeshlabs/pay-per-crawl-go' },
    repo: 'https://github.com/forgemeshlabs/pay-per-crawl-go',
    install: 'go get github.com/forgemeshlabs/pay-per-crawl-go@v0.1.1',
    snippets: [
      { label: 'net/http', file: 'main.go', lang: 'go', code: `package main

import (
	"net/http"

	"github.com/forgemeshlabs/pay-per-crawl-go/middleware"
	"github.com/forgemeshlabs/pay-per-crawl-go/paypercrawl"
)

func main() {
	site := http.FileServer(http.Dir("./public"))
	http.ListenAndServe(":8080", middleware.Handler(paypercrawl.Config{
		PayTo:    "0xYourWalletOnBase",
		PriceUSD: 0.01,
		Mode:     "monitor",
	}, site))
}` },
      { label: 'Caddy (build with xcaddy, then Caddyfile)', file: 'Caddyfile', lang: 'caddyfile', code: `# xcaddy build --with github.com/forgemeshlabs/pay-per-crawl-go/caddy
example.com {
	route {
		pay_per_crawl {
			pay_to 0xYourWalletOnBase
			price_usd 0.01
			mode monitor
		}
		file_server
	}
}` },
      { label: 'Traefik (plugin catalog, static config)', file: 'traefik.yml', lang: 'yaml', code: `experimental:
  plugins:
    payPerCrawl:
      moduleName: github.com/forgemeshlabs/pay-per-crawl-go
      version: v0.1.1
# then a middleware in your dynamic config:
# http.middlewares.ppc.plugin.payPerCrawl.payTo: 0xYourWalletOnBase` },
    ],
    env: [
      ['PayTo', 'Your 0x wallet on Base. Required in gate mode.'],
      ['PriceUSD', 'Per page fetch, default 0.01.'],
      ['Mode', 'gate or monitor.'],
      ['FacilitatorURL / FacilitatorAuth', 'Any x402 facilitator supporting exact on Base. Default PayAI.'],
      ['ClassPolicy / BotOverrides', 'free, paid or block per class and per crawler.'],
      ['AllowPaths', 'Path prefixes never gated.'],
      ['TrustedIPHeader', 'Only a header your proxy overwrites or appends. Right-most entry used.'],
      ['MPPSecret', 'Long random string so MPP challenges survive restarts and span instances.'],
      ['Lock', 'Implement paypercrawl.NonceLock over Redis or a database to share the replay lock across instances.'],
    ],
    steps: [
      'go get the module and wrap your handler, or build Caddy with the module, or add the Traefik plugin.',
      'Set PayTo and keep Mode at monitor.',
      'Read the OnHit events, then set Mode to gate.',
    ],
    gotchas: [
      'Without a verifiable IP, or when DNS is down, a search-engine claim is kept rather than charged.',
      'The Caddy download page listing is still pending; build with xcaddy for now.',
      ...COMMON_GOTCHAS,
    ],
    settlements: [
      ['x402 v1 (X-PAYMENT, network base)', '0x948aa9522f9feed31a1a8bc77e7c1de88699b1e629759f5677bd6a2e3117c4e8'],
      ['x402 v2 (PAYMENT-SIGNATURE, eip155:8453)', '0x80b5b56043bba8b4b17c95eb9759415affbf9857f8a22a249b841ac16260aebc'],
    ],
  },
  {
    slug: 'php',
    name: 'PHP',
    title: 'Charge AI crawlers in Laravel, Drupal or plain PHP',
    pitch: 'A framework-free PHP core with a Laravel middleware package and a Drupal 10/11 module on top. WordPress has its own plugin.',
    stacks: 'Laravel 10+, Drupal 10.1+ / 11, Symfony, Slim or plain PHP via the core',
    version: '0.1.0',
    registry: { label: 'Packagist', url: 'https://packagist.org/packages/forgemesh/pay-per-crawl-core' },
    repo: 'https://github.com/forgemeshlabs/pay-per-crawl-php',
    install: 'composer require forgemesh/pay-per-crawl-laravel   # or forgemesh/pay-per-crawl-drupal',
    snippets: [
      { label: 'Laravel .env (middleware joins the web group automatically)', file: '.env', lang: 'dotenv', code: `PAY_PER_CRAWL_MODE=monitor
PAY_PER_CRAWL_PAY_TO=0xYourWalletOnBase
PAY_PER_CRAWL_PRICE_USD=0.01
# php artisan migrate, then: php artisan pay-per-crawl:stats --days=7` },
      { label: 'Drupal', lang: 'bash', code: `composer require forgemesh/pay-per-crawl-drupal
drush pm:install pay_per_crawl
# then /admin/config/services/pay-per-crawl: wallet, price, Gate` },
      { label: 'Plain PHP with the core', lang: 'php', code: `use ForgeMesh\\PayPerCrawl\\{Gate, Request, NativeHttpClient};

$gate = new Gate(
    settings: ['mode' => 'gate', 'pay_to' => '0xYourWalletOnBase', 'price_usd' => 0.01, 'mpp_secret' => 'long-random-string'],
    cache: $yourCache, http: new NativeHttpClient(),
);
$result = $gate->handle(new Request($method, $uri, $absoluteUrl, $headers, $remoteIp));
if ($result->respond) { /* send $result->status, $result->headers, $result->body and stop */ }
// else render the page and add $result->passHeaders` },
    ],
    env: [
      ['mode', 'monitor (default) or gate. Without a valid wallet, gate stays monitor.'],
      ['pay_to', 'Your 0x wallet on Base.'],
      ['price_usd', 'Per page, default 0.01, minimum 0.005.'],
      ['facilitator_url / facilitator_auth', 'Any x402 facilitator supporting Base exact. Default PayAI.'],
      ['class_policy / bot_overrides', 'free, paid or block per class and per crawler.'],
      ['allow_paths', 'Prefixes never gated, matched on a segment boundary.'],
      ['trusted_ip_header', 'Only a header your proxy overwrites or appends. Right-most entry used. Never set it if the origin is reachable directly.'],
      ['mpp_secret', 'Secret for MPP challenge signing and the daily IP hash.'],
      ['cache_store (Laravel)', 'Use redis, database or file for the replay lock. The array store does not survive between requests.'],
    ],
    steps: [
      'composer require the Laravel or Drupal package. Laravel: php artisan migrate. Drupal: drush pm:install pay_per_crawl.',
      'Enter your wallet (Laravel .env, Drupal config form). Both start in monitor mode.',
      'Laravel: php artisan pay-per-crawl:stats. Drupal: /admin/reports/pay-per-crawl. Then switch to gate.',
    ],
    gotchas: [
      'Drupal gates as an http_middleware at priority 250, ahead of the page cache. A kernel.request subscriber would never see cached pages and bots would read them free.',
      'Laravel: public/llms.txt or public/robots.txt files shadow the routes because the web server serves them first.',
      'PHP rewrites the status to 401 when WWW-Authenticate is sent; the core sends the 402 after it. Keep that order in your own adapter.',
      ...COMMON_GOTCHAS,
    ],
    settlements: [
      ['x402 v1 (Laravel edition)', '0xfc7d0a33ab2baeb50f91109db26d4e882e627f66c0cb68b13363a8f7b09e3b68'],
      ['x402 v2 (Laravel edition)', '0xff1dfa134999dc4ad19bd8a9f9ae05e286e5c9e9714bc13c4979a3c073d7b63d'],
    ],
    more: [
      { label: 'Laravel on Packagist', url: 'https://packagist.org/packages/forgemesh/pay-per-crawl-laravel' },
      { label: 'Drupal on drupal.org', url: 'https://www.drupal.org/project/pay_per_crawl' },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
