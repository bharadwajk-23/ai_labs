import ContentLayout from '../layouts/ContentLayout';
import { ProjectTile } from '../components/ProjectTile';
import { useProjects } from '../hooks/useProjects';
import styles from './CatalogPage.module.css';

export default function CatalogPage() {
  const projects = useProjects();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <ContentLayout>
          <div className={styles.heroContent}>
            <div className={styles.heroEyebrow}>
              <span className={styles.eyebrowDot} />
              Youngsoft AI Labs
            </div>
            <h1 className={styles.heroTitle}>
              AI Projects<br /><span>Portfolio</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Production AI systems built for healthcare, insurance, and
              enterprise recruiting — shipped and live.
            </p>
          </div>
        </ContentLayout>
      </div>

      <div className={styles.statsStrip}>
        <ContentLayout>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Live<br/>Projects</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Industry<br/>Verticals</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>In<br/>Production</span>
            </div>
          </div>
        </ContentLayout>
      </div>

      <ContentLayout>
        <section className={styles.catalog}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>All Projects</h2>
            <span className={styles.sectionCount}>{projects.length} entries</span>
          </div>
          <div className={styles.grid}>
            {projects.map((project, index) => (
              <ProjectTile
                key={project.id}
                id={project.id}
                title={project.title}
                client={project.client}
                description={project.description}
                index={index}
              />
            ))}
          </div>
        </section>
      </ContentLayout>
    </div>
  );
}
