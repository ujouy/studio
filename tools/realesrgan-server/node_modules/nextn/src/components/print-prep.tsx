'use client';
import React, { useEffect, useMemo, useState } from 'react';
import type { ProductId } from '@/lib/product-types';

// Slots we support for size presets
type Slot = 'front' | 'back' | 'left-chest' | 'sleeve';

// Default printable areas (inches) per product/slot
const SIZE_INCHES: Record<ProductId, Record<Slot, { w: number; h: number }>> = {
  tshirt: {
    front: { w: 12, h: 16 },
    back: { w: 12, h: 16 },
    'left-chest': { w: 4, h: 4 },
    sleeve: { w: 3, h: 12 },
  },
  hoodie: {
    front: { w: 12, h: 16 },
    back: { w: 12, h: 16 },
    'left-chest': { w: 4, h: 4 },
    sleeve: { w: 3, h: 12 },
  },
  hat: {
    // Hats generally only use a front panel area
    front: { w: 4, h: 3 },
    back: { w: 4, h: 3 },
    'left-chest': { w: 4, h: 3 },
    sleeve: { w: 4, h: 3 },
  },
};

export default function PrintPrep({
  currentImage,
  productId,
  inchesX,
  inchesY,
}: {
  currentImage: string | null;
  productId: ProductId;
  inchesX?: number;
  inchesY?: number;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [slot, setSlot] = useState<Slot>('front');
  const [loading, setLoading] = useState(false);
  const [upscalerStatus, setUpscalerStatus] = useState<'unknown' | 'ok' | 'error' | 'sharp'>('unknown');

  const resolvedInches = useMemo(() => {
    const preset = SIZE_INCHES[productId]?.[slot] ?? { w: 12, h: 16 };
    return {
      w: inchesX && inchesX > 0 ? inchesX : preset.w,
      h: inchesY && inchesY > 0 ? inchesY : preset.h,
    };
  }, [productId, slot, inchesX, inchesY]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/upscale/health', { cache: 'no-store' });
        const js = await res.json();
        if (cancelled) return;
        if (js?.provider === 'sharp') setUpscalerStatus('sharp');
        else if (js?.online) setUpscalerStatus('ok');
        else setUpscalerStatus('error');
      } catch {
        if (!cancelled) setUpscalerStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function shortfall(preflight: any) {
    if (!preflight) return null;
    const dw = Math.max(0, preflight.requiredWidth - preflight.width);
    const dh = Math.max(0, preflight.requiredHeight - preflight.height);
    if (dw === 0 && dh === 0) return null;
    return { dw, dh };
  }

  async function prepare() {
    if (!currentImage) {
      setStatus('No image available');
      return;
    }
    setLoading(true);
    setStatus('Preparing for print...');
    try {
      const res = await fetch('/api/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUri: currentImage, inchesX: resolvedInches.w, inchesY: resolvedInches.h }),
      });
      const json = await res.json();
      setResult(json);
      if (res.ok && json.ok) {
        setStatus('Ready for print — download below.');
      } else {
        setStatus('Upscale finished — check preflight messages.');
      }
    } catch (e: any) {
      setStatus('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  const delta = shortfall(result?.preflight);

  return (
    <section aria-label="Print Preparation" className="mt-6 rounded border p-4">
      <h3 className="font-semibold mb-3">Prepare for Print (300 DPI)</h3>

      <div className="flex flex-wrap items-end gap-3">
        <div className="text-sm">
          {upscalerStatus === 'ok' && <span className="text-green-700">✅ Upscaler online</span>}
          {upscalerStatus === 'sharp' && <span className="text-blue-700">ℹ️ Sharp (local) provider</span>}
          {upscalerStatus === 'error' && <span className="text-red-700">⚠️ Upscaler offline — using Sharp fallback</span>}
          {upscalerStatus === 'unknown' && <span className="text-muted-foreground">Checking upscaler…</span>}
        </div>
        <label className="flex flex-col text-sm">
          Slot
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value as Slot)}
            className="border rounded px-2 py-1"
          >
            <option value="front">Front</option>
            <option value="back">Back</option>
            <option value="left-chest">Left Chest</option>
            <option value="sleeve">Sleeve</option>
          </select>
        </label>
        <div className="text-sm text-muted-foreground">
          Target: {resolvedInches.w}" × {resolvedInches.h}" (≈ {Math.round(resolvedInches.w * 300)} × {Math.round(resolvedInches.h * 300)} px)
        </div>
        <button
          onClick={prepare}
          disabled={!currentImage || loading}
          className={`px-3 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          {loading ? 'Processing…' : 'Prepare for Print'}
        </button>
        {status && <span className="text-sm">{status}</span>}
      </div>

      {delta && (
        <div className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
          The image is below target by
          {delta.dw > 0 && <> width {delta.dw}px</>} {delta.dw > 0 && delta.dh > 0 && ' and '}
          {delta.dh > 0 && <> height {delta.dh}px</>}. It will be upscaled.
        </div>
      )}

      {result?.upscaledDataUri && (
        <div className="mt-3">
          <a href={result.upscaledDataUri} download="print-ready.png" className="underline text-purple-600">
            Download print-ready PNG
          </a>
          <pre className="text-xs mt-2 whitespace-pre-wrap">
            {JSON.stringify(result.preflight, null, 2)}
          </pre>
        </div>
      )}

      {Array.isArray(result?.warnings) && result.warnings.length > 0 && (
        <div className="text-amber-700 mt-2">
          <strong>Warnings:</strong>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result.warnings, null, 2)}</pre>
        </div>
      )}

      {Array.isArray(result?.errors) && result.errors.length > 0 && (
        <div className="text-red-600 mt-2">
          <strong>Errors:</strong>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result.errors, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}
