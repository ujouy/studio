'use client';
import React, { useEffect, useMemo, useState } from 'react';

type UpscalerHealth = {
  provider: 'sharp' | 'realesrgan' | string;
  online: boolean;
  status: string;
};

const DEFAULT_POLL = 60000;

export default function UpscalerBadge() {
  const [health, setHealth] = useState<UpscalerHealth | null>(null);
  const [lastChecked, setLastChecked] = useState<number | null>(null);

  const pollMs = useMemo(() => {
    const val = Number(process.env.NEXT_PUBLIC_UPSCALER_POLL_MS);
    return Number.isFinite(val) && val > 0 ? val : DEFAULT_POLL;
  }, []);

  useEffect(() => {
    let canceled = false;
    async function fetchHealth() {
      try {
        const resp = await fetch('/api/upscale/health', { cache: 'no-store' });
        const json = await resp.json();
        if (!canceled) {
          setHealth(json);
          setLastChecked(Date.now());
        }
      } catch (e) {
        if (!canceled) {
          setHealth({ provider: 'realesrgan', online: false, status: 'error' });
          setLastChecked(Date.now());
        }
      }
    }
    fetchHealth();
    const interval = setInterval(fetchHealth, pollMs);
    return () => { canceled = true; clearInterval(interval); };
  }, [pollMs]);

  let label = 'Upscaler: …';
  let classes = 'text-muted-foreground';

  if (health) {
    if (health.provider === 'sharp') {
      label = 'Upscaler: Sharp (local)';
      classes = 'text-blue-600';
    } else if (health.online) {
      label = 'Upscaler: Online';
      classes = 'text-green-600';
    } else {
      label = 'Upscaler: Offline (fallback)';
      classes = 'text-red-600';
    }
  }

  const title = lastChecked ? `Last checked: ${new Date(lastChecked).toLocaleTimeString()}` : 'Checking…';

  return (
    <span className={`whitespace-nowrap text-xs font-medium ${classes}`} title={title}>{label}</span>
  );
}
