import { type CSSProperties, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContentLayout from '../layouts/ContentLayout';
import { FeatureCard } from '../components/FeatureCard';
import { HighlightList } from '../components/HighlightList';
import NotFound from '../components/NotFound';
import { useProject } from '../hooks/useProjects';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './ProjectDetailPage.module.css';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = useProject(id ?? '');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setSelectedImage(null);
  }, [id]);

  // Auto-scrolling slideshow for screenshots
  useEffect(() => {
    if (!project || !project.screenshots || project.screenshots.length <= 1) return;

    const intervalId = setInterval(() => {
      setSelectedImage((prevSelected) => {
        const currentImage = prevSelected ?? project.image;
        const currentIndex = project.screenshots!.indexOf(currentImage);
        const nextIndex = (currentIndex + 1) % project.screenshots!.length;
        return project.screenshots![nextIndex];
      });
    }, 4000);

    return () => clearInterval(intervalId);
  }, [selectedImage, id, project?.screenshots, project?.image]);

  const [headerRef, headerRevealed] = useScrollReveal<HTMLDivElement>(0.02, true);
  const [mockupRef, mockupRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);
  const [aboutRef, aboutRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);
  const [whyBuyRef, whyBuyRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);
  const [savingsRef, savingsRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);
  const [techRef, techRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);
  const [ctaRef, ctaRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);
  const [highlightsRef, highlightsRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);
  const [featuresRef, featuresRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);

  if (!project) {
    return <NotFound message={`No project found with id "${id}"`} />;
  }

  return (
    <div 
      className={styles.page}
      style={{
        '--brand-color': project.color,
        '--brand-gradient': project.gradient,
      } as CSSProperties}
    >
      {/* ── Background Glow Blobs ────────────────────── */}
      <div className={styles.detailGlow} />

      <ContentLayout>
        {/* Navigation Breadcrumb */}
        <Link to="/" className={styles.back}>
          <svg
            className={styles.backIcon}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M13 7H1M6 2L1 7l5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to catalog
        </Link>

        {/* ── Split Layout Grid ────────────────────────── */}
        <div className={styles.splitLayout}>
          
          {/* Left Column: Visuals & Core Information */}
          <div className={styles.mainCol}>
            <div ref={headerRef} className={`${styles.headerArea} reveal-item-left ${headerRevealed ? 'revealed' : ''}`}>
              <span className={styles.clientLabel}>{project.client}</span>
              <h1 className={styles.title}>{project.title}</h1>
              {project.sales_tagline && (
                <p className={styles.salesTagline}>{project.sales_tagline}</p>
              )}
            </div>

            {/* Premium Mockup Frame */}
            <div ref={mockupRef} className={`${styles.mockupContainer} reveal-item ${mockupRevealed ? 'revealed' : ''}`}>
              <div className={styles.mockupGlow} />
              {project.use_iframe && project.demo_url ? (
                <div className={styles.iframeWrapper}>
                  <iframe
                    src={project.demo_url}
                    title={project.title}
                    className={styles.detailIframe}
                  />
                </div>
              ) : (
                <>
                  <img 
                    key={selectedImage ?? project.image}
                    src={selectedImage ?? project.image} 
                    alt={project.title} 
                    className={styles.mockupImage} 
                  />
                  {project.screenshots && project.screenshots.length > 1 && (
                    <div 
                      key={`progress-${selectedImage ?? project.image}`}
                      className={styles.progressBar} 
                    />
                  )}
                </>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {project.screenshots && project.screenshots.length > 0 && (
              <div className={styles.galleryContainer}>
                {project.screenshots.map((shot, idx) => {
                  const isActive = (selectedImage ?? project.image) === shot;
                  return (
                    <button
                      key={idx}
                      className={`${styles.thumbnailBtn} ${isActive ? styles.thumbnailBtnActive : ''}`}
                      onClick={() => setSelectedImage(shot)}
                      aria-label={`View screenshot ${idx + 1}`}
                    >
                      <img src={shot} alt={`${project.title} screenshot ${idx + 1}`} className={styles.thumbnailImg} />
                      <div className={styles.thumbnailOverlay} />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Description Section */}
            <div ref={aboutRef} className={`${styles.contentSection} reveal-item ${aboutRevealed ? 'revealed' : ''}`}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionDot} /> Project Summary
              </h2>
              <p className={styles.description}>{project.description}</p>
            </div>

            {/* Why Buy This Solution (Sales Section) */}
            {project.why_buy && project.why_buy.length > 0 && (
              <div ref={whyBuyRef} className={`${styles.contentSection} reveal-item ${whyBuyRevealed ? 'revealed' : ''}`}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionDot} /> Why Choose This Solution
                </h2>
                <ul className={styles.salesList}>
                  {project.why_buy.map((point, index) => (
                    <li key={index} className={styles.salesListItem}>
                      <svg className={styles.checkmarkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Time & Operational Savings (Sales Section) */}
            {project.time_savings && project.time_savings.length > 0 && (
              <div ref={savingsRef} className={`${styles.contentSection} reveal-item ${savingsRevealed ? 'revealed' : ''}`}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionDot} /> Workload & Time Savings
                </h2>
                <div className={styles.savingsContainer}>
                  {project.time_savings.map((point, index) => (
                    <div key={index} className={styles.savingsCard}>
                      <svg className={styles.clockIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <p className={styles.savingsText}>{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Capabilities */}
            <div ref={techRef} className={`${styles.contentSection} reveal-item ${techRevealed ? 'revealed' : ''}`}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionDot} /> Core Capabilities
              </h2>
              <div className={styles.techGrid}>
                {project.capabilities.map(cap => (
                  <div key={cap} className={styles.techTag}>
                    <span className={styles.techTagDot} />
                    {cap}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Actions, Highlights, & Features */}
          <div className={styles.sideCol}>
            
            {/* Sandbox Demo CTA Card */}
            {project.demo_url && (
              <div ref={ctaRef} className={`${styles.ctaBox} reveal-item-right ${ctaRevealed ? 'revealed' : ''}`}>
                <div className={styles.ctaBoxGlow} />
                <h3 className={styles.ctaTitle}>Experience in Real-Time</h3>
                <p className={styles.ctaDesc}>
                  Open the live interactive deployment to evaluate latency, interface responsiveness, and system capabilities.
                </p>
                
                <div className={styles.salesActions}>
                  <a 
                    href={project.demo_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.primarySalesCta}
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    Launch Live Sandbox
                    <svg className={styles.externalCtaIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {/* Highlights Section */}
            <div ref={highlightsRef} className={`${styles.contentSection} reveal-item-right ${highlightsRevealed ? 'revealed' : ''}`}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionDot} /> Project Highlights
              </h2>
              <HighlightList items={project.highlights} />
            </div>
          </div>
        </div>

        {/* Key Features (Full Width Bottom Grid) */}
        <div ref={featuresRef} className={`${styles.featuresSection} reveal-item ${featuresRevealed ? 'revealed' : ''}`}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionDot} /> Key Features & Technical Details
          </h2>
          <div className={styles.featuresGrid}>
            {project.features.map(f => (
              <FeatureCard key={f.name} name={f.name} description={f.description} />
            ))}
          </div>
        </div>

      </ContentLayout>
    </div>
  );
}
