import type { ReactNode } from 'react';
import styles from './ContentLayout.module.css';

interface ContentLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function ContentLayout({ children, className }: ContentLayoutProps) {
  return (
    <div className={[styles.content, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
