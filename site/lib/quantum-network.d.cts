import type { IncomingHttpHeaders } from 'node:http';
export function isPrivateAddr(ip: string): boolean;
export function requestPinned(host: string, addr: string, path: string, method?: string): Promise<{status: number; headers: IncomingHttpHeaders; body: Buffer}>;
export function parseHsts(value: string | null): {max_age: number; include_subdomains: boolean; preload: boolean} | null;
export function isManifest(body: Buffer): boolean;
