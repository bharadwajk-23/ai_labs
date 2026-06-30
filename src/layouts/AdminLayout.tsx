import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import AmbientBackground from '../components/AmbientBackground';
import CursorGlow from '../components/CursorGlow';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem('ys_portfolio_theme');
    return (savedTheme === 'obsidian' || savedTheme === 'light') ? savedTheme : 'obsidian';
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ys_portfolio_theme', theme);
  }, [theme]);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('ys_admin_token');
    const isAuth = !!token;
    setIsAuthenticated(isAuth);

    // Redirect logic
    if (isAuth) {
      if (location.pathname === '/admin' || location.pathname === '/admin/') {
        navigate('/admin/dashboard', { replace: true });
      }
    } else {
      if (location.pathname.startsWith('/admin/dashboard')) {
        navigate('/admin', { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('ys_admin_token');
    setIsAuthenticated(false);
    navigate('/admin', { replace: true });
  };

  // Prevent flash of unauthenticated content during check
  if (isAuthenticated === null) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Verifying Session...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminRoot}>
      <AmbientBackground />
      <CursorGlow />
      <main className={styles.content}>
        {/* Pass down authentication context and theme controls */}
        <Outlet context={{ handleLogout, theme, setTheme }} />
      </main>
    </div>
  );
}

