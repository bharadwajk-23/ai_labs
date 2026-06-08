import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  name: string;
  description: string;
}

export function FeatureCard({ name, description }: FeatureCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
