import { memo, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/Badge';
import styles from './ProjectTile.module.css';

function deriveAccentColor(id: string): string {
  const sum = Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `hsl(${sum % 360}, 65%, 50%)`;
}

interface ProjectTileProps {
  id: string;
  title: string;
  client: string;
  description: string;
  index: number;
}

export const ProjectTile = memo(function ProjectTile({
  id,
  title,
  client,
  description,
  index,
}: ProjectTileProps) {
  const accent = deriveAccentColor(id);

  return (
    <Link
      to={`/projects/${id}`}
      className={styles.tile}
      style={{ '--delay': `${index * 0.09}s` } as CSSProperties}
    >
      <div className={styles.accentBar} style={{ background: accent }} />
      <div className={styles.body}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <Badge>{client}</Badge>
        </div>
        <p className={styles.description}>{description}</p>
        <div className={styles.footer}>
          <span className={styles.cta}>
            View project
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M1 7h12M8 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
});
