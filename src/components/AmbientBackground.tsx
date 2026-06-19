import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import styles from './AmbientBackground.module.css';

const PARTICLE_COUNT = 28;

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: 2 + (i % 3),
  delay: `${(i * 0.7) % 12}s`,
  duration: `${14 + (i % 8)}s`,
}));

export default function AmbientBackground() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className={styles.ambient} aria-hidden="true">
      <div className={styles.aurora} />
      <div className={styles.auroraSecondary} />
      <div className={styles.meshGrid} />
      <div className={styles.noise} />
      {!reducedMotion && (
        <div className={styles.particleField}>
          {particles.map((p) => (
            <span
              key={p.id}
              className={styles.particle}
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>
      )}
      <div className={styles.scanlines} />
    </div>
  );
}
