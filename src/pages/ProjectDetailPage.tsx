import { type CSSProperties, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContentLayout from '../layouts/ContentLayout';
import { FeatureCard } from '../components/FeatureCard';
import NotFound from '../components/NotFound';
import { useProject } from '../hooks/useProjects';
import { useScrollReveal } from '../hooks/useScrollReveal';
import type { Project } from '../data/schema';
import styles from './ProjectDetailPage.module.css';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = useProject(id ?? '');
  const [projectState, setProjectState] = useState<typeof project>(project);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    setProjectState(project);
    setSelectedImage(null);
    setIsLightboxOpen(false);
  }, [id, project]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(!!localStorage.getItem('ys_admin_token'));
    }
  }, []);

  // Auto-scrolling slideshow for screenshots
  useEffect(() => {
    if (!projectState || !projectState.screenshots || projectState.screenshots.length <= 1) return;

    const intervalId = setInterval(() => {
      setSelectedImage((prevSelected) => {
        const currentImage = prevSelected ?? projectState.image;
        const currentIndex = projectState.screenshots!.indexOf(currentImage);
        const nextIndex = (currentIndex + 1) % projectState.screenshots!.length;
        return projectState.screenshots![nextIndex];
      });
    }, 4000);

    return () => clearInterval(intervalId);
  }, [selectedImage, id, projectState?.screenshots, projectState?.image]);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [id]);

  const [headerRef, headerRevealed] = useScrollReveal<HTMLDivElement>(0.02, true);
  const [mockupRef, mockupRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);
  const [aboutRef, aboutRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);
  const [ctaRef, ctaRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);
  const [featuresRef, featuresRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);

  const handleDetailScreenshotsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const promises = Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(base64Images => {
      if (!projectState) return;

      const currentScreenshots = projectState.screenshots ? [...projectState.screenshots] : [];
      const updatedScreenshots = [...currentScreenshots, ...base64Images];

      const updatedProject = {
        ...projectState,
        screenshots: updatedScreenshots
      };

      try {
        const customProjectsStr = localStorage.getItem('ys_custom_projects') || '[]';
        const customProjects = JSON.parse(customProjectsStr) as Project[];
        const index = customProjects.findIndex(p => p.id === projectState.id);

        if (index !== -1) {
          customProjects[index] = updatedProject;
        } else {
          customProjects.push(updatedProject);
        }
        localStorage.setItem('ys_custom_projects', JSON.stringify(customProjects));
        setProjectState(updatedProject);
        
        if (base64Images[0]) {
          setSelectedImage(base64Images[0]);
        }
      } catch (err) {
        console.error('Error saving uploaded screenshots:', err);
      }
    });
  };

  if (!projectState) {
    return <NotFound message={`No project found with id "${id}"`} />;
  }

  const galleryImages = projectState.screenshots && projectState.screenshots.length > 0
    ? projectState.screenshots
    : [];

  return (
    <div
      className={styles.page}
      style={{
        '--brand-color': projectState.color,
        '--brand-gradient': projectState.gradient,
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
            >
            </path>
          </svg>
          Back to catalog
        </Link>

        {/* ── Split Layout Grid ────────────────────────── */}
        <div className={styles.splitLayout}>

          {/* Left Column: Visuals & Core Information */}
          <div className={styles.mainCol}>
            {/* Premium Mockup Frame */}
            <div
              ref={mockupRef}
              className={`${styles.mockupContainer} reveal-item ${mockupRevealed ? 'revealed' : ''}`}
              style={{ '--reveal-delay': isLoaded ? '0ms' : '100ms' } as CSSProperties}
            >
              <div className={styles.mockupGlow} />
              {projectState.use_iframe && projectState.demo_url ? (
                <div className={styles.iframeWrapper}>
                  <iframe
                    src={projectState.demo_url}
                    title={projectState.title}
                    className={styles.detailIframe}
                  />
                </div>
              ) : (
                <>
                  <button
                    className={styles.mockupImageWrapper}
                    onClick={() => setIsLightboxOpen(true)}
                    aria-label="Open full image"
                  >
                    <img
                      key={selectedImage ?? projectState.image}
                      src={selectedImage ?? projectState.image}
                      alt={projectState.title}
                      className={styles.mockupImage}
                    />
                  </button>
                  {galleryImages.length > 1 && (
                    <div
                      key={`progress-${selectedImage ?? projectState.image}`}
                      className={styles.progressBar}
                    />
                  )}
                </>
              )}
            </div>
            {/* Gallery Thumbnails */}
            {(galleryImages.length > 0 || isAdmin) && (
              <div className={styles.galleryContainer}>
                {galleryImages.map((shot, idx) => {
                  const isActive = (selectedImage ?? projectState.image) === shot;
                  return (
                    <button
                      key={idx}
                      className={`${styles.thumbnailBtn} ${isActive ? styles.thumbnailBtnActive : ''}`}
                      onClick={() => setSelectedImage(shot)}
                      aria-label={`View screenshot ${idx + 1}`}
                    >
                      <img src={shot} alt={`${projectState.title} screenshot ${idx + 1}`} className={styles.thumbnailImg} />
                      <div className={styles.thumbnailOverlay} />
                    </button>
                  );
                })}

                {/* Admin direct upload button */}
                {isAdmin && (
                  <div className={styles.adminUploadThumbnail}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleDetailScreenshotsUpload}
                      id="detail-screenshot-upload"
                      className={styles.hiddenFileInput}
                    />
                    <label htmlFor="detail-screenshot-upload" className={styles.adminUploadBtn} title="Upload screenshots directly">
                      ➕ Add Image
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Admin Dedicated Screenshots Upload Section */}
            {isAdmin && (
              <div className={styles.adminUploadSection}>
                <h3 className={styles.adminUploadTitle}>
                  📸 Project Screenshot Directory Upload
                </h3>
                <p className={styles.adminUploadDesc}>
                  Select or drag multiple screenshots to showcase inside the gallery for this project directory.
                </p>
                <div className={styles.dropZone}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleDetailScreenshotsUpload}
                    id="detail-gallery-upload-box"
                    className={styles.hiddenFileInput}
                  />
                  <label htmlFor="detail-gallery-upload-box" className={styles.dropZoneLabel}>
                    <span>📤 Select Multiple Screenshot Files to Upload</span>
                  </label>
                </div>
              </div>
            )}

            {/* Key Features */}
            <div
              ref={featuresRef}
              className={`${styles.featuresSection} reveal-item ${featuresRevealed ? 'revealed' : ''}`}
              style={{ '--reveal-delay': isLoaded ? '0ms' : '300ms' } as CSSProperties}
            >
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionDot} /> Key Features
              </h2>
              <div className={styles.featuresGrid}>
                {projectState.features.map(f => (
                  <FeatureCard key={f.name} name={f.name} description={f.description} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Actions, Highlights, & Features */}
          <div className={styles.sideCol}>
            <div
              ref={headerRef}
              className={`${styles.headerArea} reveal-item ${headerRevealed ? 'revealed' : ''}`}
              style={{ '--reveal-delay': isLoaded ? '0ms' : '150ms' } as CSSProperties}
            >
              <h1 className={styles.title}>{projectState.title}</h1>
              {projectState.sales_tagline && (
                <p className={styles.salesTagline}>{projectState.sales_tagline}</p>
              )}
            </div>

            {/* Description Section (Project Summary) */}
            <div
              ref={aboutRef}
              className={`${styles.contentSection} reveal-item ${aboutRevealed ? 'revealed' : ''}`}
              style={{ '--reveal-delay': isLoaded ? '0ms' : '200ms' } as CSSProperties}
            >
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionDot} /> Project Summary
              </h2>
              <p className={styles.description}>{projectState.description}</p>
            </div>

            {/* Sandbox Demo CTA Card */}
            {projectState.demo_url && (
              <div
                ref={ctaRef}
                className={`${styles.ctaBox} reveal-item ${ctaRevealed ? 'revealed' : ''}`}
                style={{ '--reveal-delay': isLoaded ? '0ms' : '250ms' } as CSSProperties}
              >
                <div className={styles.ctaBoxGlow} />
                <h3 className={styles.ctaTitle}>Experience in Real-Time</h3>

                <div className={styles.salesActions}>
                  <a
                    href={projectState.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.primarySalesCta}
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    Launch Sandbox
                    <svg className={styles.externalCtaIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>

      </ContentLayout>
      {isLightboxOpen && (
        <div className={styles.lightbox} onClick={() => setIsLightboxOpen(false)}>
          <button className={styles.lightboxClose} onClick={() => setIsLightboxOpen(false)} aria-label="Close image">
            ✕
          </button>
          <img
            src={selectedImage ?? projectState.image}
            alt={projectState.title}
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
