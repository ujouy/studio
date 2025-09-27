'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const os = require('os');
const crypto = require('crypto');
const { spawn } = require('child_process');
const sharp = require('sharp');

// Env helpers and defaults
const env = (k, d) => (process.env[k] !== undefined ? process.env[k] : d);
const PORT = Number(env('PORT', 9070)); // preserve existing default
const LOG_LEVEL = env('UPSCALE_LOG_LEVEL', 'info');
const BIN = path.resolve(env('REAL_ESRGAN_BIN', path.join(__dirname, 'bin', 'realesrgan-ncnn-vulkan.exe')));
const MODELS_DIR = path.resolve(env('REAL_ESRGAN_MODELS_DIR', path.join(__dirname, 'bin', 'models')));
const MODEL = env('REAL_ESRGAN_MODEL', 'realesrgan-x4plus');
const GPU_ID = env('REAL_ESRGAN_GPU_ID', '0'); // set to numeric string (e.g., "0") to force a device; non-numeric => auto
const TILE_SIZE = env('REAL_ESRGAN_TILE_SIZE', '0'); // 0 = auto
const TTA = /^true$/i.test(env('REAL_ESRGAN_TTA', 'false'));
const TIMEOUT_MS = Number(env('REAL_ESRGAN_TIMEOUT_MS', '120000'));
const MIN_FACTOR = Number(env('UPSCALE_MIN_FACTOR_FOR_ESRGAN', '1.5'));
const OUTPUT_FMT = env('UPSCALE_OUTPUT_FORMAT', 'png'); // png | jpg | webp

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

const log = (level, msg, obj) => {
  if (LOG_LEVEL === 'silent') return;
  const order = ['error', 'warn', 'info', 'debug'];
  const cur = order.indexOf(LOG_LEVEL);
  const lvl = order.indexOf(level);
  if (lvl <= cur || LOG_LEVEL === 'debug') {
    console.log(`[${level}] ${msg}`, obj || '');
  }
};

const haveBinary = () => fs.existsSync(BIN) && fs.existsSync(MODELS_DIR);
const shouldEnableESRGAN = () => {
  const mode = env('REAL_ESRGAN_ENABLED', 'auto').toLowerCase();
  if (mode === 'true') return true;
  if (mode === 'false') return false;
  return haveBinary();
};

const tmpFile = (suffix) => path.join(os.tmpdir(), `realesrgan_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${suffix}`);

const pickESRScale = (desiredFactor) => {
  // Supported integer scales are typically 2, 3, 4. Choose the smallest >= desired.
  const allowedAsc = [2, 3, 4];
  for (const s of allowedAsc) {
    if (desiredFactor <= s) return s;
  }
  return 4;
};

const runRealesrgan = async (inputPath, outputPath, esrScale) => {
  const baseArgs = ['-i', inputPath, '-o', outputPath, '-n', MODEL, '-s', String(esrScale), '-m', MODELS_DIR];
  const gpu = String(GPU_ID).trim();
  if (/^-?\d+$/.test(gpu)) {
    baseArgs.push('-g', gpu);
  } // non-numeric => let binary auto-select device
  const tile = parseInt(TILE_SIZE, 10);
  if (Number.isFinite(tile) && tile > 0) baseArgs.push('-t', String(tile));
  if (TTA) baseArgs.push('-x');

  const spawnOnce = (args) => new Promise((resolve, reject) => {
    const child = spawn(BIN, args, { windowsHide: true });
    let stderr = '';
    const timer = setTimeout(() => {
      try { child.kill(); } catch {}
      reject(new Error(`Real-ESRGAN timed out after ${TIMEOUT_MS} ms`));
    }, TIMEOUT_MS);
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('error', (err) => { clearTimeout(timer); reject(err); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) resolve({ ok: true });
      else reject(new Error(`Real-ESRGAN exited ${code}: ${stderr}`));
    });
  });

  try {
    return await spawnOnce(baseArgs);
  } catch (e) {
    // Retry once without explicit -g if GPU selection was invalid
    if (/invalid gpu device/i.test(String(e?.message || ''))) {
      const retryArgs = baseArgs.filter((a, i, arr) => !(a === '-g' || (i > 0 && arr[i - 1] === '-g')));
      log('warn', 'Retrying Real-ESRGAN without explicit -g due to invalid gpu device');
      return await spawnOnce(retryArgs);
    }
    throw e;
  }
};

const upscaleWithSharp = async (buf, w, h) => sharp(buf).resize(Number(w), Number(h), { kernel: sharp.kernel.lanczos3 }).toFormat(OUTPUT_FMT).toBuffer();

// POST /upscale
// Accepts: { image_b64: string, target_w: number, target_h: number }
// Returns: { upscaled_base64: string }
app.post('/upscale', async (req, res) => {
  try {
    const { image_b64, target_w, target_h } = req.body || {};
    if (!image_b64 || !target_w || !target_h) {
      return res.status(400).json({ error: 'Missing parameters (image_b64, target_w, target_h)' });
    }

    let inputBuf;
    try {
      inputBuf = Buffer.from(String(image_b64), 'base64');
    } catch {
      return res.status(400).json({ error: 'image_b64 is not valid base64' });
    }

    // Determine desired factor from original dimensions
    let desiredFactor = 0;
    try {
      const meta = await sharp(inputBuf).metadata();
      if (meta?.width && meta?.height) {
        const fx = Number(target_w) / meta.width;
        const fy = Number(target_h) / meta.height;
        desiredFactor = Math.max(fx, fy);
      }
    } catch (e) {
      log('warn', 'sharp.metadata failed', { e: String(e) });
    }

    const useESR = shouldEnableESRGAN() && desiredFactor >= MIN_FACTOR;
    const inPath = tmpFile('.png');
    const outPath = tmpFile('.png');

    try {
      // Normalize to PNG for the CLI
      await sharp(inputBuf).png().toFile(inPath);

      if (useESR) {
        const esrScale = pickESRScale(desiredFactor || 2);
        log('info', 'Running Real-ESRGAN', { BIN, MODEL, esrScale, GPU_ID, TILE_SIZE });
        await runRealesrgan(inPath, outPath, esrScale);
        const esrBuf = await sharp(outPath).toBuffer();
        // Post-resize to exact target dims if needed
        const finalBuf = await sharp(esrBuf).resize(Number(target_w), Number(target_h)).toFormat(OUTPUT_FMT).toBuffer();
        return res.json({ upscaled_base64: finalBuf.toString('base64') });
      } else {
        log('info', 'Using Sharp fallback', { reason: useESR ? 'ESR unavailable' : `factor ${desiredFactor.toFixed?.(2) || desiredFactor} < MIN_FACTOR ${MIN_FACTOR}` });
        const out = await upscaleWithSharp(inputBuf, target_w, target_h);
        return res.json({ upscaled_base64: out.toString('base64'), fallback: true });
      }
    } finally {
      const cleanup = async (p) => { try { await fsp.unlink(p); } catch {} };
      await cleanup(inPath);
      await cleanup(outPath);
    }
  } catch (err) {
    console.error('Upscale error:', err);
    return res.status(500).json({ error: err?.message || 'Upscale failure' });
  }
});

// Simple health endpoint (keep path for Next.js health checker)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Real-ESRGAN stub server listening on port ${PORT}`);
  if (!haveBinary()) {
    console.log('Note: Real-ESRGAN binary/models not found; server will use Sharp fallback until installed.');
  }
});
