import { useParams, Link } from 'react-router-dom';
import ContentLayout from '../layouts/ContentLayout';
import { FeatureCard } from '../components/FeatureCard';
import { HighlightList } from '../components/HighlightList';
import { ExternalLink } from '../components/ui/ExternalLink';
import NotFound from '../components/NotFound';
import { useProject } from '../hooks/useProjects';
import styles from './ProjectDetailPage.module.css';

function deriveHeroGradient(id: string): string {
  const sum = Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const h = sum % 360;
  return `linear-gradient(140deg, hsl(${h}, 68%, 46%) 0%, hsl(${(h + 22) % 360}, 60%, 35%) 100%)`;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = useProject(id ?? '');

  if (!project) {
    return <NotFound message={`No project found with id "${id}"`} />;
  }

  const heroGradient = deriveHeroGradient(project.id);

  return (
    <div className={styles.page}>
      <ContentLayout>
        <Link to="/" className={styles.back}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.backIcon} aria-hidden="true">
            <path
              d="M13 7H1M6 2L1 7l5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to catalog
        </Link>

        <div className={styles.hero} style={{ background: heroGradient }}>
          <div className={styles.heroNoise} aria-hidden="true" />
          <div className={styles.heroContent}>
            <p className={styles.heroClient}>{project.client}</p>
            <h1 className={styles.heroTitle}>{project.title}</h1>
            <div className={styles.heroActions}>
              <ExternalLink href={project.demo_url} label="View Live Demo" />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>About</p>
          <p className={styles.description}>{project.description}</p>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Highlights</p>
          <HighlightList items={project.highlights} />
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Key Features</p>
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
