import { useState, useMemo } from 'react';
import ContentLayout from '../layouts/ContentLayout';
import { ProjectTile } from '../components/ProjectTile';
import { useProjects } from '../hooks/useProjects';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { formatTypeLabel } from '../utils/format';
import styles from './CatalogPage.module.css';

const typesList = [
  'knowledge search',
  'reports',
  'predictive analytics',
  'transcription',
  'patient&clinic portals',
  'voice'
];

type VerticalType = 'All' | 'Healthcare' | 'Insurance' | 'Recruitment';

export default function CatalogPage() {
  const projects = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<VerticalType>('All');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);



  const [heroRef, heroRevealed] = useScrollReveal<HTMLDivElement>(0.02, true);
  const [controlsRef, controlsRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);
  const [headerRef, headerRevealed] = useScrollReveal<HTMLDivElement>(0.05, true);

  // Helper to map project to verticals
  const getVerticals = (projectId: string): VerticalType[] => {
    const verticals: VerticalType[] = [];
    if (
      projectId.includes('scriber') || 
      projectId.includes('medical') || 
      projectId.includes('ptmantra') || 
      projectId.includes('ortele') || 
      projectId.includes('planetrehab') || 
      projectId.includes('drx') ||
      projectId.includes('mta-health-plan-chatbot') ||
      projectId.includes('intelligent-reporting-system') ||
      projectId.includes('medicare')
    ) {
      verticals.push('Healthcare');
    }
    if (
      projectId.includes('chatbot') || 
      projectId.includes('health-plan')
    ) {
      verticals.push('Insurance');
    }
    if (
      projectId.includes('recruitment') || 
      projectId.includes('ysiras')
    ) {
      verticals.push('Recruitment');
    }
    return verticals;
  };

  // Filter projects based on search + vertical + capability
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const verticals = getVerticals(project.id);
      const matchesVertical = selectedVertical === 'All' || verticals.includes(selectedVertical);
      
      const matchesType = selectedTypes.length === 0 || project.types?.some(t => selectedTypes.includes(t));
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.client.toLowerCase().includes(searchLower) ||
        project.sales_tagline?.toLowerCase().includes(searchLower);
        
      return matchesVertical && matchesType && matchesSearch;
    });
  }, [projects, searchTerm, selectedVertical, selectedTypes]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedVertical('All');
    setSelectedTypes([]);
  };

  return (
    <div className={styles.page}>
      {/* ── Background Neon Glows ──────────────────────── */}
      <div className={styles.glowBgLeft} />
      <div className={styles.glowBgRight} />

      <ContentLayout>
        {/* ── Sales-Focused Hero Section ─────────────────── */}
        <section 
          ref={heroRef} 
          className={`${styles.heroSection} reveal-item ${heroRevealed ? 'revealed' : ''}`}
        >
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Intelligent AI Agents <br />
              <span className={styles.heroGradient}>Automating Complex Enterprise Workflows</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Experience built, active software integrations that simplify information search, automate report building, and transcribe clinical records with complete data compliance.
            </p>
            <div className={styles.heroActions}>
              <a href="#catalog-grid" className={styles.heroPrimaryBtn}>
                Explore Active Solutions
              </a>
            </div>
          </div>
        </section>

        {/* ── Interactive Catalog ─────────────────────────── */}
        <section className={styles.catalog}>
          <div 
            ref={controlsRef} 
            className={`${styles.controlsSection} reveal-item ${controlsRevealed ? 'revealed' : ''}`}
          >
            {/* Search Input */}
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search projects by title, client, or business value..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className={styles.searchClearBtn} aria-label="Clear search">
                  ✕
                </button>
              )}
            </div>

            {/* Filter Controls Row */}
            <div className={styles.filtersWrapper}>
              <div className={styles.verticalGroup}>
                <span className={styles.filterLabel}>Verticals:</span>
                <div className={styles.pillsRow}>
                  {(['All', 'Healthcare', 'Insurance', 'Recruitment'] as VerticalType[]).map(vert => (
                    <button
                      key={vert}
                      onClick={() => {
                        setSelectedVertical(vert);
                        setSelectedTypes([]);
                      }}
                      className={`${styles.pillBtn} ${selectedVertical === vert ? styles.pillActive : ''}`}
                    >
                      {vert}
                    </button>
                  ))}
                </div>
              </div>

              {/* Types group */}
              <div className={styles.techGroup}>
                <span className={styles.filterLabel}>Types:</span>
                <div className={styles.pillsRow}>
                  <button
                    onClick={() => setSelectedTypes([])}
                    className={`${styles.pillBtnSmall} ${selectedTypes.length === 0 ? styles.pillActiveSmall : ''}`}
                  >
                    All Types
                  </button>
                  {typesList.map(typeItem => (
                    <button
                      key={typeItem}
                      onClick={() => {
                        setSelectedTypes(prev =>
                          prev.includes(typeItem)
                            ? prev.filter(t => t !== typeItem)
                            : [...prev, typeItem]
                        );
                      }}
                      className={`${styles.pillBtnSmall} ${selectedTypes.includes(typeItem) ? styles.pillActiveSmall : ''}`}
                    >
                      {formatTypeLabel(typeItem)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div 
            id="catalog-grid" 
            ref={headerRef} 
            className={`${styles.sectionHeader} reveal-item ${headerRevealed ? 'revealed' : ''}`}
          >
            <h2 className={styles.sectionTitle}>
              {searchTerm || selectedVertical !== 'All' || selectedTypes.length > 0 ? 'Filtered Results' : 'Featured Catalog'}
            </h2>
            <span className={styles.sectionCount}>{filteredProjects.length} matching</span>
          </div>

          {filteredProjects.length > 0 ? (
            <div className={styles.grid}>
              {filteredProjects.map((project, index) => (
                <div key={project.id} className={styles.gridItem}>
                  <ProjectTile
                    id={project.id}
                    title={project.title}
                    client={project.client}
                    description={project.description}
                    image={project.image}
                    color={project.color}
                    gradient={project.gradient}
                    types={project.types}
                    demo_url={project.demo_url}
                    use_iframe={project.use_iframe}
                    sales_tagline={project.sales_tagline}
                    index={index}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <svg className={styles.noResultsIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21L16.65 16.65" />
                <path d="M8 11h6" />
              </svg>
              <h3>No matching projects found</h3>
              <p>We couldn't find anything matching your filters. Try resetting them to see the full list.</p>
              <button onClick={handleResetFilters} className={styles.resetBtn}>
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </ContentLayout>    </div>
  );
}
