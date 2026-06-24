import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect, FormEvent } from 'react';
import AmbientBackground from '../components/AmbientBackground';
import CursorGlow from '../components/CursorGlow';
import styles from './RootLayout.module.css';

export default function RootLayout() {
  const [splashState, setSplashState] = useState<'visible' | 'fading' | 'hidden'>('visible');

  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem('ys_portfolio_theme');
    return (savedTheme === 'obsidian' || savedTheme === 'light') ? savedTheme : 'obsidian';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ys_portfolio_theme', theme);
  }, [theme]);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (splashState === 'visible') {
      const fadeTimeout = setTimeout(() => {
        setSplashState('fading');
      }, 1600);

      const hideTimeout = setTimeout(() => {
        setSplashState('hidden');
      }, 2200);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, [splashState]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setIsSubmitted(true);
  };

  const closeContactModal = () => {
    setIsContactOpen(false);
    setIsSubmitted(false);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.root}>
      <AmbientBackground />
      <CursorGlow />



      {splashState !== 'hidden' && (
        <div className={`${styles.splash} ${splashState === 'fading' ? styles.fadeOut : ''}`}>
          <div className={styles.splashContent}>
            <div className={styles.splashLogo} aria-hidden="true">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Stem of Y / base (Corporate Blue) */}
                <path d="M50 50 V82" stroke="#0f4c81" strokeWidth="12" strokeLinecap="round" />
                {/* Left branch of Y (Corporate Orange) */}
                <path d="M22 22 L50 50" stroke="#f26522" strokeWidth="12" strokeLinecap="round" />
                {/* Right branch of Y (Corporate Green) */}
                <path d="M78 22 L50 50" stroke="#107c41" strokeWidth="12" strokeLinecap="round" />
                {/* Interactive theme nodes */}
                <circle cx="22" cy="22" r="10" fill="#f26522" />
                <circle cx="78" cy="22" r="10" fill="#107c41" />
                <circle cx="50" cy="50" r="7" fill="var(--color-brand)" />
                <circle cx="50" cy="82" r="10" fill="#0f4c81" />

              </svg>
            </div>
            <div className={styles.splashLogoText}>
              <div className={styles.splashWordmark}>
                <span className={styles.logoYoung}>young</span>
                <span className={styles.logoSoft}>soft</span>
              </div>
              <div className={styles.logoUnderline}>
                <div className={styles.lineOrange} />
                <div className={styles.lineGreen} />
              </div>
              <span className={styles.logoLabs}>AI LABS</span>
            </div>
            <p className={styles.splashSubtitle}>Enterprise-Grade AI Agents & System Integrations</p>
            <div className={styles.splashLoader}>
              <div className={styles.splashProgress} />
            </div>
          </div>
        </div>
      )}

      <header className={`${styles.nav} ${isScrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.brand}>
            <div className={styles.logoContainer}>
              <svg className={styles.logoMarkSvg} width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Stem of Y / base (Corporate Blue) */}
                <path d="M50 50 V82" stroke="#0f4c81" strokeWidth="12" strokeLinecap="round" />
                {/* Left branch of Y (Corporate Orange) */}
                <path d="M22 22 L50 50" stroke="#f26522" strokeWidth="12" strokeLinecap="round" />
                {/* Right branch of Y (Corporate Green) */}
                <path d="M78 22 L50 50" stroke="#107c41" strokeWidth="12" strokeLinecap="round" />
                {/* Interactive theme nodes */}
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
          </Link>
          <div className={styles.navSeparator} />
          <div className={styles.navDescription}>
            <span className={styles.navTitle}>AI Agents Portfolio</span>
            <span className={styles.navSubtitle}>Enterprise-Grade AI Agents & System Integrations</span>
          </div>
          <div className={styles.navRight}>
            <a
              href="https://youngsoft.in/about-us/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navLink}
            >
              About Us
            </a>
            <button
              onClick={() => setIsContactOpen(true)}
              className={styles.navCtaBtn}
            >
              Connect with Us
            </button>
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
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} Youngsoft India Pvt. Ltd.
          </p>
        </div>
      </footer>

      {isContactOpen && (
        <div className={styles.modalBackdrop} onClick={closeContactModal}>
          <div className={styles.contactCardWrapper} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cardGlow} />
            <div className={styles.contactCard}>
              <button className={styles.modalCloseBtn} onClick={closeContactModal} aria-label="Close modal">
                ✕
              </button>
              
              {!isSubmitted ? (
                <form onSubmit={handleContactSubmit} className={styles.contactForm}>
                  <h3 className={styles.formTitle}>Connect with Us</h3>
                  <p className={styles.formSub}>
                    Have a custom AI requirement or want to discuss enterprise solutions? Drop us a line below.
                  </p>
                  
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="contact-name">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Your Name"
                      className={styles.formInput}
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                  
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="contact-email">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className={styles.formInput}
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      placeholder="Tell us about your project/requirements..."
                      className={styles.formTextarea}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                    />
                  </div>
                  
                  <button type="submit" className={styles.submitBtn}>
                    Send Message
                  </button>
                </form>
              ) : (
                <div className={styles.successContainer}>
                  <div className={styles.successIcon}>✓</div>
                  <h3 className={styles.successTitle}>Thank you, {contactName}!</h3>
                  <p className={styles.successDesc}>
                    Your message has been sent. We'll reach out to you at <strong>{contactEmail}</strong> within 24 hours.
                  </p>
                  <button className={styles.successCloseBtn} onClick={closeContactModal}>
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
