// src/lib/preflight.ts
import sharp from 'sharp';

export type PreflightResult = {
  ok: boolean;
  width: number;
  height: number;
  requiredWidth: number;
  requiredHeight: number;
  errors: string[];
  metadata: sharp.Metadata;
};

/**
 * Checks whether an image buffer meets the required pixels for a target size
 * at 300 DPI (default). Returns metadata and a list of errors if any.
 */
export async function checkPrintReadiness(
  buffer: Buffer,
  targetInchesX: number,
  targetInchesY: number,
  dpi = 300
): Promise<PreflightResult> {
  const meta = await sharp(buffer).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  const requiredWidth = Math.round(targetInchesX * dpi);
  const requiredHeight = Math.round(targetInchesY * dpi);

  const errors: string[] = [];
  if (width < requiredWidth)
    errors.push(`width ${width}px < required ${requiredWidth}px (${targetInchesX}in @${dpi}dpi)`);
  if (height < requiredHeight)
    errors.push(`height ${height}px < required ${requiredHeight}px (${targetInchesY}in @${dpi}dpi)`);

  return {
    ok: errors.length === 0,
    width,
    height,
    requiredWidth,
    requiredHeight,
    errors,
    metadata: meta,
  };
}
