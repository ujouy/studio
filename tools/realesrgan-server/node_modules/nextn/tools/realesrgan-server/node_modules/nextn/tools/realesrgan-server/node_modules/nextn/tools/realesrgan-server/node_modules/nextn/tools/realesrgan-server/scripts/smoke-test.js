#!/usr/bin/env node
const fs = require('fs');
const http = require('http');

const port = process.env.UPSCALE_SERVER_PORT || process.env.PORT || 9070;
const imgPath = process.argv[2] || null;
if (!imgPath) {
  console.error('Usage: node scripts/smoke-test.js <path_to_small_image.png>');
  process.exit(2);
}
const buf = fs.readFileSync(imgPath);
const postData = JSON.stringify({ image_b64: buf.toString('base64'), target_w: 768, target_h: 768 });

const req = http.request(
  { hostname: '127.0.0.1', port, path: '/upscale', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) } },
  (res) => {
    let data = '';
    res.on('data', d => data += d.toString());
    res.on('end', () => {
      try {
        const j = JSON.parse(data);
        if (j.upscaled_base64) {
          console.log('OK base64 length', j.upscaled_base64.length, j.fallback ? '(fallback)' : '');
          process.exit(0);
        } else {
          console.error('Bad response', j);
          process.exit(3);
        }
      } catch (e) {
        console.error('Invalid JSON', data);
        process.exit(4);
      }
    });
  }
);
req.on('error', (e) => { console.error('Request error', e); process.exit(5); });
req.write(postData);
req.end();
