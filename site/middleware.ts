import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';

  if (host.startsWith('tikbotshop.com') || host.startsWith('www.tikbotshop.com')) {
    const { pathname } = request.nextUrl;
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/shop', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
