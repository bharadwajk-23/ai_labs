import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

interface NotFoundProps {
  message?: string;
}

export default function NotFound({ message }: NotFoundProps) {
  return (
    <div className={styles.container}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>Project not found</h1>
      {message && <p className={styles.message}>{message}</p>}
      <Link to="/" className={styles.back}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M13 7H1M6 2L1 7l5 5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to catalog
      </Link>
    </div>
  );
}
