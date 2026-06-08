import styles from './HighlightList.module.css';

interface HighlightListProps {
  items: string[];
}

export function HighlightList({ items }: HighlightListProps) {
  return (
    <ul className={styles.list}>
      {items.map(item => (
        <li key={item} className={styles.item}>
          <svg
            className={styles.icon}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M6.5 10l2.5 2.5 4.5-5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className={styles.text}>{item}</p>
        </li>
      ))}
    </ul>
  );
}
