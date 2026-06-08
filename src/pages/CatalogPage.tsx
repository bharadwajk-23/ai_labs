import ContentLayout from '../layouts/ContentLayout';
import { ProjectTile } from '../components/ProjectTile';
import { useProjects } from '../hooks/useProjects';
import styles from './CatalogPage.module.css';

export default function CatalogPage() {
  const projects = useProjects();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <ContentLayout>
          <div className={styles.heroContent}>
            <div className={styles.heroEyebrow}>
              <span className={styles.eyebrowDot} />
              Youngsoft AI Labs
            </div>
            <h1 className={styles.heroTitle}>
              AI Projects<br />Portfolio
            </h1>
            <p className={styles.heroSubtitle}>
              Production AI systems built for healthcare, insurance,
              and enterprise recruiting — shipped and live.
            </p>
          </div>
        </ContentLayout>
      </div>

      <ContentLayout>
        <section className={styles.catalog}>
          <p className={styles.sectionLabel}>
            {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
          </p>
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
