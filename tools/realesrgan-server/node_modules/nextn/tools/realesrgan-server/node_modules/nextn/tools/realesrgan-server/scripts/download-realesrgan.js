#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');
const unzipper = require('unzipper');

const DEFAULT_URL =
  'https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesrgan-ncnn-vulkan-20220424-windows.zip';

async function downloadAndUnzip(url = DEFAULT_URL) {
  const binDir = path.resolve(__dirname, '..', 'bin');
  if (!fs.existsSync(binDir)) fs.mkdirSync(binDir, { recursive: true });

  console.log(`Downloading Real-ESRGAN binary from ${url} …`);
  const zipPath = path.join(binDir, 'realesrgan-windows.zip');

  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(zipPath);
    const maxRedirects = 5;
    const download = (u, redirects = 0) => {
      https.get(u, (res) => {
        // Follow GitHub release redirects to objects.githubusercontent.com
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          if (redirects >= maxRedirects) return reject(new Error('Too many redirects'));
          const nextUrl = new URL(res.headers.location, u).toString();
          res.resume(); // discard body before following
          return download(nextUrl, redirects + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Download failed: status ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      }).on('error', reject);
    };
    download(url);
  });

  console.log('Unzipping binary …');
  await fs
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: binDir }))
    .promise();

  // Flatten extracted folder so BIN and models are at known paths
  try {
    const exePath = path.join(binDir, 'realesrgan-ncnn-vulkan.exe');
    if (!fs.existsSync(exePath)) {
      const entries = fs
        .readdirSync(binDir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && d.name.startsWith('realesrgan-ncnn-vulkan'));
      if (entries[0]) {
        const extractedDir = path.join(binDir, entries[0].name);
        const move = (src, dest) => {
          if (fs.existsSync(src)) {
            // If destination exists, remove it first to avoid EXDEV errors
            try { if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true }); } catch {}
            fs.renameSync(src, dest);
          }
        };
        move(path.join(extractedDir, 'realesrgan-ncnn-vulkan.exe'), exePath);
        move(path.join(extractedDir, 'models'), path.join(binDir, 'models'));
      }
    }
  } catch (e) {
    console.warn('Post-extract flatten step failed (non-fatal):', e?.message || String(e));
  }

  fs.unlinkSync(zipPath);
  console.log('Binary installed in:', binDir);
}

if (require.main === module) {
  const url = process.argv[2] || DEFAULT_URL;
  downloadAndUnzip(url).catch((err) => {
    console.error('Download failed:', err);
    process.exit(1);
  });
}
