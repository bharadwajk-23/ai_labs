import { Link, Outlet } from 'react-router-dom';
import styles from './RootLayout.module.css';

export default function RootLayout() {
  return (
    <div className={styles.root}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.brand}>
            <div className={styles.brandMark} aria-hidden="true">YS</div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>Youngsoft India</span>
              <span className={styles.brandSub}>AI Labs</span>
            </div>
          </Link>
          <span className={styles.navBadge}>Project Portfolio</span>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} Youngsoft India Pvt. Ltd. · All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
