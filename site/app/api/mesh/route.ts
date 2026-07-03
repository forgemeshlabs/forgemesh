import { NextResponse } from 'next/server';
import { getMeshData } from '@/lib/mesh';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getMeshData();
  return NextResponse.json(data, {
    headers: { 'cache-control': 'public, max-age=20' },
  });
}
