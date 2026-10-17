// Every Pay-per-Crawl edition. Same behaviour everywhere: 402 with x402 v1 + v2
// and MPP, facilitator verify → settle on tx hash, site owner keeps 100%.
export type Edition = {
  key: string;
  name: string;
  stack: string;
  version: string;
  install: string;
  registry: { label: string; url: string };
  repo: string;
  extra?: { label: string; url: string }[];
  note?: string;
};

export const WP_VERSION = '0.2.2';
export const WP_ZIP = `https://github.com/forgemeshlabs/forgemesh-pay-per-crawl/releases/download/v${WP_VERSION}/forgemesh-pay-per-crawl-${WP_VERSION}.zip`;

export const EDITIONS: Edition[] = [
  {
    key: 'wordpress',
    name: 'WordPress',
    stack: 'Any WordPress 6.x site',
    version: WP_VERSION,
    install: 'Plugins → Add New → Upload Plugin',
    registry: { label: 'Download zip', url: WP_ZIP },
    repo: 'https://github.com/forgemeshlabs/forgemesh-pay-per-crawl',
    extra: [{ label: 'Plugin page', url: '/wordpress' }],
    note: 'wordpress.org directory listing is in review.',
  },
  {
    key: 'python',
    name: 'Python',
    stack: 'FastAPI, Flask, Django',
    version: '0.1.2',
    install: 'pip install forgemesh-pay-per-crawl',
    registry: { label: 'PyPI', url: 'https://pypi.org/project/forgemesh-pay-per-crawl/' },
    repo: 'https://github.com/forgemeshlabs/pay-per-crawl-py',
  },
  {
    key: 'javascript',
    name: 'JavaScript',
    stack: 'Cloudflare Workers, Next.js, Node (Express, Fastify, Hono, Koa), nginx njs',
    version: '0.1.1',
    install: 'npm i @forgemeshlabs/pay-per-crawl-node',
    registry: { label: 'npm', url: 'https://www.npmjs.com/package/@forgemeshlabs/pay-per-crawl-core' },
    repo: 'https://github.com/forgemeshlabs/pay-per-crawl-js',
    extra: [
      { label: '-worker', url: 'https://www.npmjs.com/package/@forgemeshlabs/pay-per-crawl-worker' },
      { label: '-next', url: 'https://www.npmjs.com/package/@forgemeshlabs/pay-per-crawl-next' },
      { label: '-node', url: 'https://www.npmjs.com/package/@forgemeshlabs/pay-per-crawl-node' },
    ],
  },
  {
    key: 'go',
    name: 'Go',
    stack: 'net/http middleware, Caddy module, Traefik plugin',
    version: '0.1.1',
    install: 'go get github.com/forgemeshlabs/pay-per-crawl-go',
    registry: { label: 'pkg.go.dev', url: 'https://pkg.go.dev/github.com/forgemeshlabs/pay-per-crawl-go' },
    repo: 'https://github.com/forgemeshlabs/pay-per-crawl-go',
    note: 'Caddy: xcaddy build with the module; Traefik: plugins catalog, topic traefik-plugin.',
  },
  {
    key: 'php',
    name: 'PHP',
    stack: 'Plain PHP, Laravel 10+, Drupal 10/11',
    version: '0.1.0',
    install: 'composer require forgemesh/pay-per-crawl-core',
    registry: { label: 'Packagist', url: 'https://packagist.org/packages/forgemesh/pay-per-crawl-core' },
    repo: 'https://github.com/forgemeshlabs/pay-per-crawl-php',
    extra: [
      { label: 'Laravel', url: 'https://packagist.org/packages/forgemesh/pay-per-crawl-laravel' },
      { label: 'Drupal (Packagist)', url: 'https://packagist.org/packages/forgemesh/pay-per-crawl-drupal' },
      { label: 'drupal.org', url: 'https://www.drupal.org/project/pay_per_crawl' },
    ],
  },
];
