import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface CountUpOptions {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  startOnReveal?: boolean;
  revealed?: boolean;
}

export function useCountUp({
  end,
  duration = 1400,
  suffix = '',
  prefix = '',
  decimals = 0,
  startOnReveal = true,
  revealed = true,
}: CountUpOptions): string {
  const reducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(reducedMotion ? end : 0);

  useEffect(() => {
    if (reducedMotion) {
      setValue(end);
      return;
    }

    if (startOnReveal && !revealed) return;

    let startTime: number | null = null;
    let raf = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, reducedMotion, startOnReveal, revealed]);

  const formatted =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();

  return `${prefix}${formatted}${suffix}`;
}
