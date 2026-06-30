import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from './AdminLoginPage.module.css';

export default function AdminLoginPage() {
  const { theme, setTheme } = useOutletContext<{ theme: string; setTheme: (t: string) => void }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      triggerError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication API call with 1.2s delay for a premium feel
    setTimeout(() => {
      // Mock validation
      if (email.trim() === 'admin@youngsoft.com' && password === 'admin123') {
        localStorage.setItem('ys_admin_token', 'mock_secure_token_' + Math.random().toString(36).substring(2));
        setIsLoading(false);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setIsLoading(false);
        triggerError('Invalid credentials. Please use admin@youngsoft.com and admin123.');
      }
    }, 1200);
  };

  const triggerError = (msg: string) => {
    setError(msg);
    setIsShaking(true);
    // Remove the shake class after animation completes (500ms)
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  return (
    <div className={styles.container}>
      {/* Dynamic Background Neon Glows */}
      <div className={styles.glowBgLeft} />
      <div className={styles.glowBgRight} />

      <button
        onClick={() => setTheme(theme === 'obsidian' ? 'light' : 'obsidian')}
        className={styles.themeToggle}
        title={theme === 'obsidian' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle Theme"
      >
        <div className={styles.iconWrapper}>
          {theme === 'obsidian' ? (
            <svg
              key="moon"
              className={styles.themeIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg
              key="sun"
              className={styles.themeIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </div>
      </button>

      <div className={`${styles.card} ${isShaking ? styles.shake : ''}`}>
        <div className={styles.logoHeader}>
          <div className={styles.logoContainer}>
            <svg className={styles.logoMarkSvg} width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 50 V82" stroke="#0f4c81" strokeWidth="12" strokeLinecap="round" />
              <path d="M22 22 L50 50" stroke="#f26522" strokeWidth="12" strokeLinecap="round" />
              <path d="M78 22 L50 50" stroke="#107c41" strokeWidth="12" strokeLinecap="round" />
              <circle cx="22" cy="22" r="10" fill="#f26522" />
              <circle cx="78" cy="22" r="10" fill="#107c41" />
              <circle cx="50" cy="50" r="7" fill="var(--color-brand)" />
              <circle cx="50" cy="82" r="10" fill="#0f4c81" />
            </svg>
            <div className={styles.logoText}>
              <div className={styles.logoWordmark}>
                <span className={styles.logoYoung}>young</span>
                <span className={styles.logoSoft}>soft</span>
              </div>
              <div className={styles.logoUnderline}>
                <div className={styles.lineOrange} />
                <div className={styles.lineGreen} />
              </div>
              <span className={styles.logoLabs}>AI LABS</span>
            </div>
          </div>
          <h1 className={styles.title}>Admin Control Center</h1>
          <p className={styles.subtitle}>Enter credentials to access the project catalog and client inquiries.</p>
        </div>

        {error && (
          <div className={styles.errorBanner} role="alert">
            <span className={styles.errorIcon}>⚠️</span>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="admin-email" className={styles.label}>Work Email</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                id="admin-email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="admin@youngsoft.com"
                autoComplete="email"
              />
              <span className={styles.inputIcon}>✉️</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="admin-password" className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="admin-password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className={styles.rememberRow}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} disabled={isLoading} />
              <span className={styles.checkboxText}>Remember this machine</span>
            </label>
            <a href="#forgot" className={styles.forgotLink} onClick={(e) => { e.preventDefault(); alert('Demo password is: admin123'); }}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className={styles.buttonLoader}>
                <div className={styles.buttonSpinner} />
                <span>Authorizing Portal...</span>
              </div>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className={styles.credentialsHint}>
          <span className={styles.hintTitle}>💡 Quick Sandbox Login:</span>
          <div className={styles.hintDetails}>
            <p><strong>Email:</strong> <code>admin@youngsoft.com</code></p>
            <p><strong>Password:</strong> <code>admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
