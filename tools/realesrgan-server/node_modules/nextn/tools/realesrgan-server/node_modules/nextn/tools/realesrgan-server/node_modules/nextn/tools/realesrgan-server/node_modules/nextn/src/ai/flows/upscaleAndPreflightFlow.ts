// src/ai/flows/upscaleAndPreflightFlow.ts
import sharp from 'sharp';
import { dataUriToBuffer, bufferToDataUri } from '@/lib/dataUri';
import { checkPrintReadiness } from '@/lib/preflight';

export type UpscaleResult = {
  ok: boolean;
  preflight: any;
  upscaledDataUri?: string;
  mime?: string;
  errors?: string[];
  warnings?: string[];
};

export async function upscaleAndPreflightFlow(opts: {
  dataUri: string;
  targetInchesX: number;
  targetInchesY: number;
  provider?: 'sharp' | 'realesrgan' | 'google';
}): Promise<UpscaleResult> {
  const { dataUri, targetInchesX, targetInchesY, provider } = opts;
  const { buffer, mime } = dataUriToBuffer(dataUri);

  // 1) preflight before upscale
  const pre = await checkPrintReadiness(buffer, targetInchesX, targetInchesY);
  if (pre.ok) {
    return { ok: true, preflight: pre, upscaledDataUri: dataUri, mime: mime || 'image/png' };
  }

  // Guard max output size to avoid OOM
  const MAX_DIM = 10000; // adjust as needed
  const requiredW = Math.min(pre.requiredWidth, MAX_DIM);
  const requiredH = Math.min(pre.requiredHeight, MAX_DIM);
  if (pre.requiredWidth > MAX_DIM || pre.requiredHeight > MAX_DIM) {
    return { ok: false, preflight: pre, errors: ['Requested size exceeds safe max dimensions'] };
  }

  // 2) Upscale according to provider (default: sharp Lanczos3)
  let outBuffer: Buffer;
  const providerEnv = (process.env.UPSCALER_PROVIDER as 'sharp' | 'realesrgan' | 'google' | undefined) ?? 'sharp';
  const effectiveProvider = provider ?? providerEnv;

  const warnings: string[] = [];

  if (effectiveProvider === 'realesrgan') {
    const url = process.env.UPSCALER_URL;
    if (!url) {
      warnings.push('UPSCALER_URL not set; falling back to Sharp');
      outBuffer = await sharp(buffer)
        .resize(requiredW, requiredH, { kernel: sharp.kernel.lanczos3 })
        .png()
        .toBuffer();
    } else {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            image_b64: buffer.toString('base64'),
            target_w: requiredW,
            target_h: requiredH,
          }),
        });
        clearTimeout(timeout);
        if (!resp.ok) {
          const txt = await resp.text().catch(() => '');
          warnings.push(`External upscaler responded ${resp.status}. Falling back to Sharp. ${txt?.slice(0,200)}`);
          outBuffer = await sharp(buffer)
            .resize(requiredW, requiredH, { kernel: sharp.kernel.lanczos3 })
            .png()
            .toBuffer();
        } else {
          const { upscaled_base64 } = (await resp.json()) as { upscaled_base64: string };
          outBuffer = Buffer.from(upscaled_base64, 'base64');
        }
      } catch (e: any) {
        warnings.push('External upscaler unavailable; fell back to Sharp');
        outBuffer = await sharp(buffer)
          .resize(requiredW, requiredH, { kernel: sharp.kernel.lanczos3 })
          .png()
          .toBuffer();
      }
    }
  } else if (effectiveProvider === 'google') {
    // Placeholder: wire Google/Vertex upscaler here if exposed in your SDK
    outBuffer = await sharp(buffer)
      .resize(requiredW, requiredH, { kernel: sharp.kernel.lanczos3 })
      .png()
      .toBuffer();
  } else {
    outBuffer = await sharp(buffer)
      .resize(requiredW, requiredH, { kernel: sharp.kernel.lanczos3 })
      .png()
      .toBuffer();
  }

  // 3) Preflight after upscale
  const post = await checkPrintReadiness(outBuffer, targetInchesX, targetInchesY);

  return {
    ok: post.ok,
    preflight: post,
    upscaledDataUri: bufferToDataUri(outBuffer, 'image/png'),
    mime: 'image/png',
    warnings,
  };
}
