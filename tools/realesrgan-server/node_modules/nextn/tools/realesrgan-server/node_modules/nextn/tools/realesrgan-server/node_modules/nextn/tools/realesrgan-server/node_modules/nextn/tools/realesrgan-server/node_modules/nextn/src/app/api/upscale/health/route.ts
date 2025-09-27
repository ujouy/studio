// src/app/api/upscale/health/route.ts
import { NextResponse } from 'next/server';

let cache: { data: any; ts: number } | null = null;
const TTL_MS = 5000;

export async function GET() {
  try {
    const provider = (process.env.UPSCALER_PROVIDER || 'sharp').toLowerCase();
    if (provider !== 'realesrgan') {
      // Sharp (local) provider doesn't need a remote health check
      return NextResponse.json({ provider: 'sharp', online: true, status: 'sharp' });
    }

    const raw = process.env.UPSCALER_URL || '';
    if (!raw) {
      return NextResponse.json({ provider: 'realesrgan', online: false, status: 'missing-url' }, { status: 200 });
    }

    let healthUrl = raw;
    try {
      const u = new URL(raw);
      u.pathname = '/health';
      u.search = '';
      healthUrl = u.toString();
    } catch {
      // Fallback: naive string replace if URL parsing fails
      healthUrl = raw.replace(/\/upscale$/, '/health');
    }

    const now = Date.now();
    if (cache && now - cache.ts < TTL_MS) {
      return NextResponse.json(cache.data);
    }

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 3000);
    try {
      const resp = await fetch(healthUrl, { signal: controller.signal, cache: 'no-store' });
      clearTimeout(t);
      if (!resp.ok) {
        const data = { provider: 'realesrgan', online: false, status: 'bad-response' };
        cache = { data, ts: now };
        return NextResponse.json(data);
      }
      const js = await resp.json().catch(() => ({}));
      const ok = js?.status === 'ok';
      const data = { provider: 'realesrgan', online: !!ok, status: ok ? 'ok' : 'unknown' };
      cache = { data, ts: now };
      return NextResponse.json(data);
    } catch (e) {
      clearTimeout(t);
      const data = { provider: 'realesrgan', online: false, status: 'error' };
      cache = { data, ts: now };
      return NextResponse.json(data);
    }
  } catch (err: any) {
    return NextResponse.json({ provider: 'unknown', online: false, status: 'error', message: err?.message || String(err) }, { status: 500 });
  }
}
