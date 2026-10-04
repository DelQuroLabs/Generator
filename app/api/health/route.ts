import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return new NextResponse(
    JSON.stringify({
      status: 'ok',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    },
  );
}
