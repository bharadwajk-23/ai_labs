import { memo, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { formatTypeLabel } from '../utils/format';
import styles from './ProjectTile.module.css';

interface ProjectTileProps {
  id: string;
  title: string;
  description: string;
  index: number;
  image: string;
  color: string;
  gradient: string;
  types: string[];
  demo_url?: string;
  use_iframe?: boolean;
  sales_tagline?: string;
}

export const ProjectTile = memo(function ProjectTile({
  id,
  title,
  description,
  index,
  image,
  color,
  gradient,
  types,
  sales_tagline,
}: ProjectTileProps) {
  const [tileRef, isRevealed] = useScrollReveal<HTMLAnchorElement>(0.05, true);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!tileRef.current) return;
    const rect = tileRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    tileRef.current.style.setProperty('--mouse-x', `${x}px`);
    tileRef.current.style.setProperty('--mouse-y', `${y}px`);

    // 3D Tilt calculation relative to center
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Normalized delta (-0.5 to 0.5)
    const deltaX = (x - centerX) / width;
    const deltaY = (y - centerY) / height;

    // Calculate rotation angles (max 6deg tilt for a premium, subtle effect)
    const rotateY = (deltaX * 6).toFixed(2);
    const rotateX = -(deltaY * 6).toFixed(2);

    tileRef.current.style.setProperty('--tilt-x', `${rotateX}deg`);
    tileRef.current.style.setProperty('--tilt-y', `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    if (!tileRef.current) return;
    tileRef.current.style.setProperty('--tilt-x', '0deg');
    tileRef.current.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <Link
      to={`/projects/${id}`}
      ref={tileRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${styles.tile} reveal-item ${isRevealed ? 'revealed' : ''}`}
      style={{
        '--delay': `${(index % 3) * 0.08}s`, // staggered transition delay for rows of 3
        '--accent-color': color,
        '--accent-gradient': gradient,
      } as CSSProperties}
    >
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} data-project-id={id} loading="lazy" />
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>

        {sales_tagline && (
          <p className={styles.salesTagline}>{sales_tagline}</p>
        )}

        <p className={styles.description}>{description}</p>

        <div className={styles.techStack}>
          {types.map(t => (
            <span key={t} className={styles.techBadge}>{formatTypeLabel(t)}</span>
          ))}
        </div>

        <div className={styles.footer}>
          <span className={styles.cta}>
            Explore
            <svg
              className={styles.arrowIcon}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 7h10M8 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
      <div className={styles.spotlight} />
    </Link>
  );
});
