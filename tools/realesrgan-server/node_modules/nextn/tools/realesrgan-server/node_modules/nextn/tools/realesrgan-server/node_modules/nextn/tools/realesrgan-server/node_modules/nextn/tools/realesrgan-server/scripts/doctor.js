#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const exe = process.env.REAL_ESRGAN_BIN || path.resolve(__dirname, '..', 'bin', 'realesrgan-ncnn-vulkan.exe');
console.log('Checking binary at:', exe);
if (!fs.existsSync(exe)) {
  console.error('Binary not found');
  process.exit(2);
}
const run = spawnSync(exe, ['-h'], { stdio: 'inherit' });
process.exit(run.status || 0);
