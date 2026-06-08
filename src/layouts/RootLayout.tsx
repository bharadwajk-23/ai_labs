import { Link, Outlet } from 'react-router-dom';
import styles from './RootLayout.module.css';

export default function RootLayout() {
  return (
    <div className={styles.root}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.brand}>
            <div className={styles.brandMark} aria-hidden="true">AI</div>
            <span className={styles.brandName}>Youngsoft AI Labs</span>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} Youngsoft India · AI-powered products for enterprise
        </p>
      </footer>
    </div>
  );
}
