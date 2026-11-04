import { TOOL_GROUPS, featured } from './tools-catalog';

export type NavLink = { label: string; href: string; price?: string };
const rows = (id: string): NavLink[] => featured(id).map(row => ({ label: row.name, href: row.href, price: row.price }));
const pick = (...paths: string[]): NavLink[] => paths.map(href => {
  const row = TOOL_GROUPS.flatMap(group => group.rows).find(item => item.href === href);
  if (!row) throw new Error(`Navigation destination missing from catalog: ${href}`);
  return { label: row.name, href: row.href };
});

export const TOP_LINKS: NavLink[] = [
  ...pick('/dub-town', '/blog'),
  { label: 'All tools', href: '/tools' },
];

// Both desktop and mobile use these sections; names and destinations come from
// the catalog. New tools remain discoverable through each section's full list.
export const NAV_GROUPS = [
  { id: 'products', label: 'Products', sections: [
    { label: 'APIs & products', links: [...rows('paid'), { label: 'All APIs →', href: '/tools#paid' }] },
    { label: 'Install, play & shop', links: [
      { label: 'MCP servers →', href: '/tools#mcp' },
      ...pick('https://botdnd.com'),
      { label: 'All experiments →', href: '/tools#labs' },
      { label: 'Shops & merch →', href: '/tools#shops' },
    ] },
  ] },
  { id: 'explore', label: 'Explore', sections: [
    { label: 'Free tools', links: [...rows('free').filter(row => !['/blog', '/brief', '/calendar', 'https://kit.forgemesh.io'].includes(row.href)), { label: 'All free tools →', href: '/tools#free' }] },
    { label: 'News & live data', links: [
      ...pick('/brief', '/calendar', '/texas', '/repo-watch', '/verified', '/payment-rules'),
      { label: 'All data & watches →', href: '/tools#watch' },
    ] },
  ] },
  { id: 'learn', label: 'Learn', sections: [
    { label: 'Start & explore', links: [...rows('learn'), ...pick('/wallet', '/about', '/listed'), { label: 'All guides →', href: '/tools#learn' }] },
    { label: 'Courses, ebooks & kits', links: rows('guides') },
  ] },
];
