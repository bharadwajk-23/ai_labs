import styles from './ExternalLink.module.css';

interface ExternalLinkProps {
  href: string;
  label?: string;
  className?: string;
}

export function ExternalLink({ href, label = 'Open link', className }: ExternalLinkProps) {
  if (!href.startsWith('http')) {
    return <span className={styles.disabled}>{label}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[styles.link, className].filter(Boolean).join(' ')}
    >
      {label}
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path
          d="M2 11L11 2M11 2H4.5M11 2V8.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
