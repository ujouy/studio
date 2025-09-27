// src/lib/dataUri.ts
export function dataUriToBuffer(dataUri: string): { buffer: Buffer; mime: string } {
  const m = dataUri.match(/^data:(.+);base64,(.*)$/);
  if (!m) throw new Error('Invalid data URI');
  const mime = m[1];
  const b64 = m[2];
  const buffer = Buffer.from(b64, 'base64');
  return { buffer, mime };
}

export function bufferToDataUri(buffer: Buffer, mime = 'image/png'): string {
  return `data:${mime};base64,${buffer.toString('base64')}`;
}
