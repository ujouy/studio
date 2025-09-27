// src/app/api/upscale/route.ts
import { NextResponse } from 'next/server';
import { upscaleAndPreflightFlow } from '@/ai/flows/upscaleAndPreflightFlow';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dataUri, inchesX = 12, inchesY = 16, provider } = body || {};
    if (!dataUri || typeof dataUri !== 'string') {
      return NextResponse.json({ error: 'missing dataUri' }, { status: 400 });
    }
    const result = await upscaleAndPreflightFlow({
      dataUri,
      targetInchesX: Number(inchesX),
      targetInchesY: Number(inchesY),
      provider,
    });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
