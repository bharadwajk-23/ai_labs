import { useEffect } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import styles from './CursorGlow.module.css';

export default function CursorGlow() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const handler = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return <div className={styles.glow} aria-hidden="true" />;
}
